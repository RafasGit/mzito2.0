"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import Appointment from "@/app/patients/[userId]/new-appointment/page";
import { updateAppointment, updateAppointmentWithIds } from "@/lib/actions/appointment.actions";


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

    try {
      const client = {
         name, email, phone        
      };
      console.log(client)
      const patient = await registerPatient(client);
      console.log({newClient: patient.$id})
   // const newClientId = newClient.$id
    const appointmentId = appointment.$id    // You need to implement this function
    
       console.log(`hi ${appointmentId}`)
    if (!appointmentId) {
      throw new Error('No appointment ID found');
    }
    
    const appointmentToUpdate = {
      appointmentId,
      patient,
    };
    const updatedAppointment = await updateAppointmentWithIds(appointmentToUpdate);
    console.log('Appointment updated:', updatedAppointment);

    if (updatedAppointment) {
      form.reset();
      router.push(
        `/patients/${appointmentId}/new-appointment/success?appointmentId=${updatedAppointment.$id}`
      );
    }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
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

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};