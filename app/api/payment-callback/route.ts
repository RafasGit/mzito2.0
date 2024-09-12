import {  BUCKET_ID,
    DATABASE_ID,
    ENDPOINT,
    PATIENT_COLLECTION_ID,
    TRANSACTION_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users } from "@/lib/appwrite.config"; 
import { registerPatient } from "@/lib/actions/patient.actions";
import { updateAppointmentWithIds } from "@/lib/actions/appointment.actions";
import { Appointment, Transaction } from "@/types/appwrite.types";

import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
      const callbackData = await request.json();
      const { Success, Status, transaction_reference, appointmentId } = callbackData;
  
      if (Success && Status === 200) {
        // Fetch the transaction document
        const transaction : Transaction = await databases.getDocument (
          DATABASE_ID!,
          TRANSACTION_COLLECTION_ID!,
          transaction_reference
        );
  
        if (!transaction) {
          throw new Error('Transaction not found');
        }
  
        // Update the transaction status to "success"
        await databases.updateDocument(
          DATABASE_ID!,
          TRANSACTION_COLLECTION_ID!,
          transaction_reference,
          { status: 'completed' }
        );

      //  const {transact} = transaction
        // Register the patient (user)
        const client = {
          name: transaction.name,
          email: transaction.email,
          phone: transaction.phone,
        //  appointmentId: appointmentId,
        };
  
        const newPatient = await registerPatient(client);  // Create patient document in DB
  
        // Update the appointment with the new patient ID
        const appointmentToUpdate = {
          appointmentId: transaction.appointmentId ,
          //patientId: newPatient.$id,
          patient: newPatient.$id
        };
        const updatedAppointment = await updateAppointmentWithIds(appointmentToUpdate);
  
        return NextResponse.json({
          status: 'success',
          message: 'Payment successful, patient registered, and appointment updated.',
        });
      } else {
        return NextResponse.json({ status: 'failure', message: 'Payment failed.' });
      }
    } catch (error) {
      console.error('Error processing payment callback:', error);
      return NextResponse.json({ status: 'error', message: 'Error processing callback.' });
    }
  }