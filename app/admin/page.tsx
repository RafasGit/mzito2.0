import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Appointment } from "@/types/appwrite.types";

import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";


const AdminPage = async () => {
   const appointmentsResponse = await getRecentAppointmentList();

   const appointments: Appointment[] = appointmentsResponse.documents;
   const sortedAppointments = appointments.sort((a: Appointment, b: Appointment) => {
    const dateA = new Date(a.schedule);
    const dateB = new Date(b.schedule);
    return dateA.getTime() - dateB.getTime();
  });
  
  console.log(sortedAppointments);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
        <Image
            src='/assets/icons/Edu mzito(3).png'
             height={200}
             width={200}
            alt="logo"
            className="mb-8 bg-transparent"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointmentsResponse?.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointmentsResponse?.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointmentsResponse?.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={sortedAppointments} />
      </main>
    </div>
  );
};

export default AdminPage;
