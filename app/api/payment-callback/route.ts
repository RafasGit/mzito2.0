import {  
  DATABASE_ID, TRANSACTION_COLLECTION_ID, databases 
 } from "@/lib/appwrite.config"; 
 import { registerPatient } from "@/lib/actions/patient.actions";
 import { updateAppointmentWithIds } from "@/lib/actions/appointment.actions";
import { sendSmsServer } from "@/lib/useSmsSender";
 import { Appointment, Transaction } from "@/types/appwrite.types";
 import { formatDateTime } from "@/lib/utils";
 import { NextResponse, NextRequest } from "next/server";
 
 export async function POST(request: Request) {
   try {
     const callbackData = await request.json();
     const { Success, Status, transaction_reference, appointmentId } = callbackData;
 
     if (Success && Status === 200) {
       // Fetch the transaction document
       const transaction: Transaction = await databases.getDocument(
         DATABASE_ID!,
         TRANSACTION_COLLECTION_ID!,
         transaction_reference
       );
 
       if (!transaction) {
         throw new Error('Transaction not found');
       }
 
       // Update the transaction status to "completed"
       await databases.updateDocument(
         DATABASE_ID!,
         TRANSACTION_COLLECTION_ID!,
         transaction_reference,
         { status: 'completed' }
       );
 
       // Register the patient (user)
       const client = {
         name: transaction.name,
        // email: transaction.email,
         phone: transaction.phone,
       };
 
       const newPatient = await registerPatient(client);  // Create patient document in DB
 
       // Update the appointment with the new patient ID
       const appointmentToUpdate = {
         appointmentId: transaction.appointmentId,
         patient: newPatient.$id
       };
      
       const updatedAppointment : Appointment = await updateAppointmentWithIds(appointmentToUpdate);  // Assuming you update the appointment successfully
           console.log(updatedAppointment)
     
           if(updatedAppointment) {
        const handleSendSms = async () => {
          const result = await sendSmsServer({
            to: client.phone,
            message: `${client.name}, your booking for ${formatDateTime(updatedAppointment?.schedule).dateTime} successfully confirmed! `
           
          });
        }
  
        handleSendSms()
       }

        
        
           // Build the redirect URL
       const baseUrl = process.env.NEXT_PUBLIC_APP_URL! ;
       const redirectUrl = `${baseUrl}/patients/${appointmentToUpdate.appointmentId}/new-appointment/success?appointmentId=${appointmentToUpdate.appointmentId}`;
 
       // Redirect to the success page
       return NextResponse.redirect(redirectUrl, 303);
       }
     
 
  else {
      //Uncomment 
      const transaction: Transaction = await databases.getDocument(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        transaction_reference
      );

      if (!transaction) {
        throw new Error('Transaction not found');
      }
      const handleSendSms = async () => {


        const result = await sendSmsServer({
          to: transaction.phone,
          message: `${transaction.name}, appointment not confirmed. Please ensure you complete payment or try again.`
        });
      }

         handleSendSms()
       return NextResponse.json({ status: 'failure', message: 'Payment failed.' });
     }
   } catch (error) {
     console.error('Error processing payment callback:', error);
     return NextResponse.json({ status: 'error', message: 'Error processing callback.' });
   }
 }
 