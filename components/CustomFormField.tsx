import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import React, { useState, useEffect, use } from "react";
import { Calendar } from "@/components/ui/calendar";
import ReactDatePicker from "react-datepicker";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { Button } from "./ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { FormControl, FormField, FormItem, FormLabel, FormMessage,} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { time } from "console";
import { Value } from "@radix-ui/react-select";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { debounce } from 'lodash';
import dayjs from 'dayjs'


export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface TimeSlot {
  time: string;
}



interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string | null;
  placeholder?: string | null;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  timeList?: string;
  timeSlots?: TimeSlot;
  
   
}


//console.log({Cu})
const RenderInput = ({ field, props, }: { field: any; props: CustomProps }) => {
  

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
      case FormFieldType.TEXTAREA:
        return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="KE"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );


    case FormFieldType.DATE_PICKER:


// State to hold appointments fetched from the database
// const [appointments, setAppointments] = useState([]);
// const appointment = await getRecentAppointmentList();
//    setAppointments(appointment)


// Example structure of appointments array
// appointments = [
//   { id: 1, serviceProviderId: 'sp1', appointmentTime: '2024-09-03T15:00:00Z' },
//   { id: 2, serviceProviderId: 'sp2', appointmentTime: '2024-09-03T16:30:00Z' },
//   ...
// ];

interface TimeSlot {
  time: string;
}

interface Patient {
  email: string;
  phone: string;
  userId: string | null;
  name?: string;
  primaryPhysician: string | null;
  $id: string;
  $tenant: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

interface Appointment {
  appointmentId: string;
  schedule: string;
  reason: string;
  note: string;
  primaryPhysician: string;
  status: string;
  userId?: string;
  cancellationReason?: string;
  patientName?: string;
  doctorName: string;
  appointmentDate: Date;
  patient: Patient; // Assuming it's a single patient
}
interface AppointmentResponse {
  totalCount: number;
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
}

const [appointments, setAppointments] = useState<Appointment[] | null>(null);

const processAppointments = (response: AppointmentResponse | undefined) => {
  if (!response) {
    console.error('Response is undefined');
    return;
  }


  const { totalCount, scheduledCount, pendingCount, cancelledCount,  documents} = response;

   console.log(response)
  if (!documents) {
    console.error('Documents array is undefined');
    return;
  }

  // Store individual appointments
  setAppointments(documents); 
}



const fetchAppointments = async () => {
  try {
    const appointmentList = await getRecentAppointmentList();
    if (appointmentList && typeof appointmentList === 'object') {
      processAppointments(appointmentList as AppointmentResponse);
    } else {
      console.error('Received invalid appointment data:', appointmentList);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};
   

// Fetch appointments when the component mounts
useEffect(() => {
  fetchAppointments();
}, []); // Empty dependency array ensures this runs only once on mount


// if (appointments && appointments.length > 0) {
//   console.log(appointments[0]); // Log the first appointment directly
// } else {
//   console.log('No appointments available');
// }


 // Function to check if the selected time slot is booked
//  const isTimeSlotBooked = (time) => {
//   // Combine the selected date and time into a Date object
//   const selectedDateTime = new Date(field.value);
//   const [hours, minutes] = time.split(':').map(Number);
//   selectedDateTime.setHours(hours, minutes);

//   // Check if any appointment matches the selected time and service provider
//   return appointments.some(
//     (appointment) =>
//       appointment.serviceProviderId === selectedServiceProvider &&
//       new Date(appointment.appointmentTime).getTime() === selectedDateTime.getTime()
//   );
// };
  
     

   
const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
const [bookedSlot, setBookedSlot] = useState<TimeSlot[]>([]); // Assuming bookedSlot is your booked appointments

      const [selectedTime, setSelectedTime] = useState<string>();


    //   useEffect(() => {
    //     businessBookedSlot();
    //   }
    // )
       
    const handleFieldChange = (newValue: Date | undefined) => {
      if (!newValue) {
        console.error('Selected date is undefined');
        return;
      }
    
      const fieldValue = newValue.toISOString().split('T')[0]; // Convert Date to 'YYYY-MM-DD' format
     // console.log(fieldValue);
      console.log(field.value);
      // Assuming `appointments` is available here, pass it along with fieldValue
      businessBookedSlot(fieldValue, appointments);
    };
    
     const adjustDate = (selectedDate: Date) => {
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setDate(adjustedDate.getDate() + 1); // Add one day to the selected date
      return adjustedDate;
    };

      const businessBookedSlot = (fieldValue: string, appointments: Appointment[]| null) => {
        if (!fieldValue) {
          console.error('Field value is undefined or empty');
          return;
        }
      
        // Convert field.value into a Date object
        const selectedDate = new Date(fieldValue);
        const adjustedDate = adjustDate(selectedDate);
        console.log(`date originale: ${selectedDate}`)
        console.log(`date nuevo: ${adjustedDate}`)
        if (isNaN(selectedDate.getTime())) {
          console.error('Invalid date');
          return;
        }
      
        // Filter appointments for the selected date
        if (appointments && appointments.length > 0) {
        const filteredAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.schedule);
          return appointmentDate.toDateString() === adjustedDate.toDateString();
        });
      
        console.log(`Appointments on ${adjustedDate.toDateString()}:`, filteredAppointments);
        
  // Map the filteredAppointments to TimeSlot[] format
    const bookedSlots = filteredAppointments.map((appointment) => ({
     time: new Date(appointment.schedule).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }), // Convert appointment.schedule to the correct time format
   }));

  setBookedSlot(bookedSlots); // Set the correct format in setBookedSlot

  return bookedSlots;
      }
      };
     

      const handleTimeSlotSelection = (time: string) => {
        if (!field.value) return; // Ensure a date is selected first
      
        // Parse the selected date into a Date object
        const selectedDate = new Date(field.value);
      
        // Split the selected time into hours and minutes
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':').map(Number);
      
         // Convert 12-hour format to 24-hour format
      if (period === 'PM' && hours < 12) {
    hours += 12;
     } else if (period === 'AM' && hours === 12) {
    hours = 0;
    }

      // Set hours and minutes to the selectedDate object
    selectedDate.setHours(hours, minutes);

     // Update field.value with the combined date and time
    field.onChange(selectedDate);
   setSelectedTime(time); // Keep track of the selected time
  }; 
  
  useEffect(() => {
    getTime();
  }, []);
  
  const getTime = () => {
    const timeList: TimeSlot[] = [];
  
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" });
      timeList.push({ time: i + ":30 AM" });
    }
  
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: i + ":00 PM" });
      timeList.push({ time: i + ":30 PM" });
    }
  
    setTimeSlot(timeList);
  };
  
  // Helper function to add or subtract 30 minutes to a given time slot
  const adjustTime = (time: string, adjust: number): string => {
    const [hours, minutes, period] = time.split(/[:\s]/); // Split "12:30 PM" into components
    let hour = parseInt(hours);
    let minute = parseInt(minutes);
    if (period === "PM" && hour !== 12) hour += 12; // Convert PM hours to 24-hour format
  
    const date = new Date();
    date.setHours(hour, minute, 0, 0); // Set the date object with time
  
    // Add or subtract 30 minutes
    date.setMinutes(date.getMinutes() + adjust);
  
    const newHour = date.getHours();
    const newMinute = date.getMinutes() === 0 ? "00" : "30";
    const newPeriod = newHour >= 12 ? "PM" : "AM";
    const formattedHour = newHour % 12 === 0 ? 12 : newHour % 12;
  
    return `${formattedHour}:${newMinute} ${newPeriod}`;
  };
  
  // Function to check if a time slot or its adjacent slots are booked
  const isBookedOrAdjacent = (time: string): boolean => {
    const beforeTime = adjustTime(time, -30); // Get the previous time slot
    const afterTime = adjustTime(time, 30); // Get the next time slot
  
    // Check if the time slot or its adjacent slots are in the bookedSlot array
    return (
      bookedSlot.some((slot) => slot.time === time) ||
      bookedSlot.some((slot) => slot.time === beforeTime) ||
      bookedSlot.some((slot) => slot.time === afterTime)
    );
  };
     

      return (
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <FormControl>
            <Button
                      variant={"outline"}
                      className={cn(
                        "w-[33.75rem] h-[44.75px] pl-3 text-left font-normal shad-gray-btn",
                        !field.value && "text-muted-foreground"
                      )}
                    >
             {field.value?  (
           <>
         {format(field.value, "PPP h:mm aa")}
          </>
                     ) :(
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                    </Button>
                    </FormControl>
            </SheetTrigger>
            <SheetContent className=" h-22 bg-neutral-950  overflow-auto">
              <SheetHeader>
                <SheetTitle>Book a Service </SheetTitle>
                <SheetDescription>
                  Select Date and Time slot to book an service
                  <div className=" ml-[-12px] flex flex-col gap-5 items-baseline">
                    <h2 className="mt-5 font-bold">Select Date</h2>
                    <Calendar
                       mode="single"
                       selected={field.value}
                       onSelect={(date) => {
                       field.onChange(date); // Update the field with the selected date
                        handleFieldChange(date); // Call your custom handler
                                          }}
                       className="rounded-md border pl-2"
                     />

                  </div>
                  <h2 className="my-5 font-bold">Select Time Slot</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlot.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        disabled={isBookedOrAdjacent(item.time)} //
                        className={`border rounded-full p-2 px-3 hover:bg-black hover:text-white ${
                          selectedTime === item.time ? "bg-white text-black" : ""
                        }`}
                       
                        onClick={() => handleTimeSlotSelection(item.time)}
                      >
                        {item.time}
                      </Button>
                    ))}
                  </div>
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className="mt-5">
                <SheetClose asChild>
                  <div className="flex gap-2">
                    <Button variant="destructive" className=" shad-danger-btn w-24">
                      Cancel
                    </Button>
    
                    <Button className="shad-primary-btn w-24"
                      //disabled={(date !(selectedTime && date) || date > new Date() }
                     
                    >
                      Confirm
                    </Button>
                  </div>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
   }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;


    {/* <FormControl>

            

            {/* <ReactDatePicker
              showTimeSelect={props.showTimeSelect! ?? false}
               selected={field.value}
              onChange={(date) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
              
            /> */}
            // </FormControl> */}