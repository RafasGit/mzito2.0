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
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const callbackData = await request.json();
    const { Success, Status, transaction_reference, appointmentId } = callbackData;

    // Fetch the transaction document
    const transaction: Transaction = await databases.getDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transaction_reference
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (Success && Status === 200) {
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
        phone: transaction.phone,
      };

      const newPatient = await registerPatient(client);

      // Update the appointment with the new patient ID
      const appointmentToUpdate = {
        appointmentId: transaction.appointmentId,
        patient: newPatient.$id
      };
    
      const updatedAppointment: Appointment = await updateAppointmentWithIds(appointmentToUpdate);
      console.log(updatedAppointment);

      if (updatedAppointment) {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Africa/Nairobi',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        //console.log(updatedAppointment.schedule)
      //  const formattedDate=formatDateTime(updatedAppointment.schedule).dateTime
       // console.log(`new ${formattedDate}`)
       const formattedDate = (updatedAppointment?.schedule ?? new Date()).toLocaleString('en-US', options);
        await sendSmsServer({
          to: client.phone,
          message: `${client.name}, your booking for ${formattedDate} successfully confirmed!`
        });
      }

      // Build the redirect URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const redirectUrl = `${baseUrl}/patients/${appointmentToUpdate.appointmentId}/new-appointment/success?appointmentId=${appointmentToUpdate.appointmentId}`;

      // Redirect to the success page
      return NextResponse.redirect(redirectUrl, {
        status: 303,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      // Payment failed
      await sendSmsServer({
        to: transaction.phone,
        message: `${transaction.name}, appointment not confirmed. Please ensure you complete payment or try again.`
      });

      return NextResponse.json(
        { status: 'failure', message: 'Payment failed.' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json({ status: 'error', message: 'Error processing callback.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}