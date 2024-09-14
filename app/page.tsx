import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import { AppointmentForm } from "@/components/forms/AppointmentForm";


const Home = ({searchParams}: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
        <Image
            src='/assets/icons/Edu mzito(3).png'
             height={200}
             width={200}
            alt="logo"
            className="mb-12 bg-transparent"
          />
         <AppointmentForm
           type="create"
          />


          {/* <PatientForm /> */}

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Mzito SuperCuts
            </p>
            <Link href="/?admin=true" className="text-[hsl(36,61%,58%)]">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/mzito.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;