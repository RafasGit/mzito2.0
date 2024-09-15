import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
 
  const patient = await getPatient(userId);

  console.log(userId)
  console.log(patient)
  console.log('hi')

  return (
    <div className="flex h-screen max-h-screen">
      <section className=" overflow-hidden remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
            src='/assets/icons/Edu mzito(3).png'
             height={200}
             width={200}
            alt="logo"
            className="mb-12 bg-transparent"
          />

          <AppointmentForm
            patientId={patient?.$id} 
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 SuperCuts</p>
        </div>
      </section>

      <Image
        src="/assets/images/mzito.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;