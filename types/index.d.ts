/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  declare type Gender = "Male" | "Female" | "Other";
  declare type Status = "pending" | "scheduled" | "cancelled";
  
  declare interface CreateUserParams {
    name: string;
   // email?: string;
    phone: string;
  }
  declare interface User extends CreateUserParams {
    $id: string;
  }
  
  declare interface RegisterUserParams extends CreateUserParams {
   
  }
  
 declare type PaymentParams = {
  name: string;
  phone: string;
  email: string;
  appointmentId: string;

 }

  declare type CreateAppointmentParams = {
   // userId: string;
   // patient: string;
    primaryPhysician: string;
    reason: string;
    schedule: Date;
    status: Status;
    note: string | undefined;
  };
  
  
  // New type for updating appointment with IDs
declare type UpdateAppointmentWithIdsParams = {
  appointmentId: string;
  //userId: string;
  patient: string;
};

 declare type UpdateAppointmentParams = {
  //userId: string | undefined;
  appointmentId: string;
  appointment: {
    primaryPhysician: string;
    schedule: Date;
    status: Status;
    cancellationReason?: string;
  };
  type: "create" | "schedule" | "cancel";
};