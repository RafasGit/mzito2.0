"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { initiatePayment } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import Appointment from "@/app/patients/[userId]/new-appointment/page";
import { updateAppointment, updateAppointmentWithIds } from "@/lib/actions/appointment.actions";
import { toast } from "sonner";

interface Appointment {
  schedule: string;
  reason: string;
  note: string;
  primaryPhysician: string;
  status: string;
  $id: string;
  $createdAt: string;
  patient: string | null;
  userId: string | null;
  // ... other properties
}


export const PatientForm = ({appointment} : {appointment: Appointment} ) => {
  

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async ({name, email, phone}: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    const appointmentId = appointment.$id    // You need to implement this function
 
    try {
      const client = {
         name, 
         email, 
         phone, 
         appointmentId    
      };
     // console.log(client)
      const newTransaction = await initiatePayment(client);
      if (newTransaction) {
        console.log(`Payment initiated, transaction_reference: ${newTransaction}`);
        toast.success('Appointment successfully created!');
        router.push(
          `/patients/${appointmentId}/new-appointment/success?appointmentId=${appointment.$id}`
        )   
      }
      
  
    
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while creating the appointment. Please try again.');
    }

    setIsLoading(false);
  };
    
 
  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 ml-3 sm:ml-0 sm:space-y-10 px-4 sm:px-6 max-w-screen-sm max-h-svh sm:max-w-screen-xl mx-auto w-full">
      <section className="mb-6 sm:mb-12 space-y-2 sm:space-y-4">
        <h1 className="header text-xl sm:text-4xl">Hi there 👋</h1>
        <p className="text-dark-700 text-sm sm:text-xl">Confirm payment details to complete your booking.</p>
      </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Book Now</SubmitButton>
      </form>
    </Form>
  );
};