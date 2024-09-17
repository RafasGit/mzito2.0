import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser, } from "@/lib/actions/patient.actions";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { PatientForm } from "@/components/forms/PatientForm";

const Register = async ({ searchParams, params: { userId } }: SearchParamProps) => {
  const appointmentid = userId;
  const appointment = await getAppointment(appointmentid);
  // console.log({appointment})

  //if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className=" overflow-hidden overflow-y-hidden flex flex-col md:flex-row h-max max-h-screen">
      <section className=" overflow-hidden remove-scrollbar container">
        <div className="   overflow-hidden sub-container max-w-[860px] flex-1 flex-col py-10 w-full">
        <Image
          src='/assets/icons/Edu mzito(3).png'
          height={200}
          width={200}
          alt="logo"
          className="mb-12 ml-8 sm:ml-6 bg-transparent w-full max-w-[200px]" // Added w-full and max-w
        />

        <PatientForm appointment={appointment} />

          <p className="copyright py-12">© 2024 Mzito SuperCuts</p>
        </div>
      </section>

        <Image
          src="/assets/images/register-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img w-full max-w-[390px]" // Added w-full and max-w
        />
    </div>
  );
};

export default Register;