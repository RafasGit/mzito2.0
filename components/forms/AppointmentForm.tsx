"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Doctors, ServicesA, ServicesB } from "@/constants";

import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import { format, parseISO } from "date-fns";


export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId?: string;
  patientId?: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedDoctor?: (doctorName: string) => void;

}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const appointmentSchedule = appointment ? new Date(appointment.schedule) : null;
  const AppointmentFormValidation = getAppointmentSchema(type);
 
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
      ? new Date(new Date(appointment?.schedule!))
      : new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });
  
  

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    
    try {
      if (type === "create" ) {
        const appointment = {
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };
        console.log(appointment.schedule)

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {

         router.push(`/patients/${newAppointment.$id}/register`);
        
         toast.success('Appointment details confirmed!')

        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          toast.success('Appointment details confirmed! Fill in your details to complete booking')
         // form.reset();
        }
      }
          } catch (error) {
            console.log(error);
          }
          setIsLoading(false);
        };

        let buttonLabel;
        switch (type) {
          case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
          case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
          default:
            buttonLabel = "Submit Apppointment";
        }

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value);
    
  };
   return (
    <Form {...form}>
     
          <form onSubmit={form.handleSubmit(onSubmit)}
           style={{ backgroundImage: `url('/assets/images/footer-bg.png')` }}
          className=" overflow-hidden border-transparent p-6 bg-stone-900  flex-1 space-y-6  z-50 rounded-3xl">



        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>


            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Chair"
              placeholder="Select a chair"
              options={Doctors.map((doctor, i) => ({
                value: doctor.name,
                label: doctor.name,
                image: doctor.image,

              }))}
              onValueChange={handleDoctorChange}
            />

          
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              dateFormat="MM/dd/yyyy  -  h:mm aa"
              selectedDoctor={selectedDoctor}
              type={type}
              apptValue={appointmentSchedule}
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-col"}`}
            >
           
                  
            <CustomFormField
              fieldType={FormFieldType.SALECT}
              control={form.control}
              name="reason"
              label="Choose service"
              placeholder="Select a service"
              options={selectedDoctor!=='Chair three: Jeff' ? ServicesA.map((service, i) => ({
                value: service.name,
                label: service.name,
                image: service.image,
                duration: service.duration,
                amount: service.amount
             
              })) :
              ServicesB.map((service, i) => ({
                value: service.name,
                label: service.name,
                image: service.image,
                duration: service.duration,
                amount: service.amount
              }))

            }
            
            />

          

                

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder='appointment comments'
                disabled={type === "schedule"}
              />
            </div>
              </>
            )}

            {type === "cancel" && (
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Urgent meeting came up"
              />
            )}

          <SubmitButton
            isLoading={isLoading}
            className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
          >
            {buttonLabel}
          </SubmitButton>
        </form>
      </Form>
  );
};