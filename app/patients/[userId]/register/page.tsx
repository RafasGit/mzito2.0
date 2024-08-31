import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser, } from "@/lib/actions/patient.actions";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { PatientForm } from "@/components/forms/PatientForm";

const Register = async ({ searchParams, params: { userId } }: SearchParamProps) => {
  const appointmentId = userId;
  const appointment = await getAppointment(appointmentId);
   console.log({appointmentId})

  //if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

        <PatientForm />

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;