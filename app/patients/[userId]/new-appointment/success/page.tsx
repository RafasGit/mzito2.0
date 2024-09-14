import Image from "next/image";
import Link from "next/link";

import LoadingButton from "@/components/LoadingButton";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";


const RequestSuccess = async ({
    searchParams,
    params: { userId },
  }: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || "";
    const appointment = await getAppointment(appointmentId);
  
    const doctor = Doctors.find(
      (doctor) => doctor.name === appointment?.primaryPhysician
    );
  
    return (
      <div className=" flex h-screen max-h-screen px-[5%]">
        <div className="success-img">
          <Link href="/">
          <Image
            src='/assets/icons/Edu mzito(3).png'
             height={200}
             width={200}
            alt="logo"
            className="mb-8 bg-transparent"
          />
          </Link>
  
          <section className="flex flex-col items-center">
            <Image
              src="/assets/gifs/success.gif"
              height={200}
              width={200}
              alt="success"
              unoptimized
            />
            <h2 className="header mb-6 max-w-[600px] text-center">
              Your <span className="text-[hsl(36,61%,58%)]">appointment request</span> has
              been successfully submitted!
            </h2>
            <p>We&apos;ll be in touch shortly to confirm.</p>
          </section>
  
          <section className="request-details">
            <p>Requested appointment details: </p>
            <div className="flex items-center gap-3">
              <Image
                src={doctor?.image!}
                alt="doctor"
                width={100}
                height={100}
                 className="mb-0 h-10 w-fit bg-neutral-50 "/>
              <p className="whitespace-nowrap"> {doctor?.name}</p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <p> {formatDateTime(appointment?.schedule).dateTime}</p>
            </div>
          </section>
  
          <LoadingButton href={`/patients/${userId}/new-appointment`}>
          New Appointment
        </LoadingButton>

  
          <p className="copyright">© 2024 Mzito Supercuts</p>
        </div>
      </div>
    );
  };
  
  export default RequestSuccess;