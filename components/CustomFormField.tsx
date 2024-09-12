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
import InlineExpandingSelect from "./ui/inlineExpand";
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
import TimeSlotGrid from "./timeslot";
import CustomSelect from "./ui/custom-select";
import { Doctors } from "@/constants";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  SALECT = "salect"
}

interface TimeSlot {
  time: string;
}


interface Option {
  image: string;
  name: string;
  amount?: string;
  duration?: string;
}


interface SelectOption {
  value: string;
  label: string;
  image?: string;
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string | null;
  placeholder?: string | null ;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode  ;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  timeList?: string;
  options?: SelectOption[];
  timeSlots?: TimeSlot;
  doctorValue?: string | null;
 // selectedDoctor?: any;
  setSelectedDoctor?: (value: any) => void;
  selectedDoctor?: string | null;
  onValueChange?: (value: string) => void;
  
}


//console.log({Cu})
const RenderInput = ({ field, props,  }: { field: any; props: CustomProps }) => {

 
  //const [selectedDoctor, setSelectedDoctor] = useState(props.doctorValue);
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


  //  case FormFieldType.DATE_PICKER:

  // interface TimeSlot {
  //   time: string;
  //   isBooked: boolean;
  // }

  // interface Patient {
  //   email: string;
  //   phone: string;
  //   userId: string | null;
  //   name?: string;
  //   primaryPhysician: string | null;
  //   $id: string;
  //   $tenant: string;
  //   $createdAt: string;
  //   $updatedAt: string;
  //   $permissions: any[];
  //   $databaseId: string;
  //   $collectionId: string;
  // }

  // interface Appointment {
  //   appointmentId: string;
  //   schedule: string;
  //   reason: string;
  //   note: string;
  //   primaryPhysician: string;
  //   status: string;
  //   userId?: string;
  //   cancellationReason?: string;
  //   patientName?: string;
  //   doctorName: string;
  //   appointmentDate: Date;
  //   patient: Patient; // Assuming it's a single patient
  // }
  // interface AppointmentResponse {
  //   totalCount: number;
  //   scheduledCount: number;
  //   pendingCount: number;
  //   cancelledCount: number;
  //   documents: Appointment[];
  // }

  //  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  //  const processAppointments = (response: AppointmentResponse | undefined) => {
  //   if (!response) {
  //     console.error('Response is undefined');
  //     return;
  //   } 


  //   const { totalCount, scheduledCount, pendingCount, cancelledCount,  documents} = response;

  //     console.log(response)
  //     if (!documents) {
  //       console.error('Documents array is undefined');
  //       return;
  //     }

  //     // Store individual appointments
  //       setAppointments(documents); 
  //   }



  //    const fetchAppointments = async () => {
  //     try {
  //       const appointmentList = await getRecentAppointmentList();
  //       if (appointmentList && typeof appointmentList === 'object') {
  //         processAppointments(appointmentList as AppointmentResponse);
  //       } else {
  //         console.error('Received invalid appointment data:', appointmentList);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching appointments:', error);
  //     }
  //   };
      

  //      // Fetch appointments when the component mounts
  //        useEffect(() => {
  //         fetchAppointments();
  //       }, []); // Empty dependency array ensures this runs only once on mount



  //   //   console.log(appointments[0]); // Log the first appointment directly
  //   // } else {
  //   //   console.log('No appointments available');
  //   // }


  //   // Function to check if the selected time slot is booked
  //   //  const isTimeSlotBooked = (time) => {
  //   //   // Combine the selected date and time into a Date object
  //   //   const selectedDateTime = new Date(field.value);
  //   //   const [hours, minutes] = time.split(':').map(Number);
  //   //   selectedDateTime.setHours(hours, minutes);

  //   //   // Check if any appointment matches the selected time and service provider
  //   //   return appointments.some(
  //   //     (appointment) =>
  //   //       appointment.serviceProviderId === selectedServiceProvider &&
  //   //       new Date(appointment.appointmentTime).getTime() === selectedDateTime.getTime()
  //   //   );
  //   // };
      
        

      
  //   const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  //   const [bookedSlot, setBookedSlot] = useState<TimeSlot[]>([]); // Assuming bookedSlot is your booked appointments
  //   const [selectedTime, setSelectedTime] = useState<string | undefined>();
  //   const [fieldValue, setFieldValue] = useState<string | null>(null); 

  //       //   useEffect(() => {
  //       //     businessBookedSlot();
  //       //   }
  //       // )
  //       // useEffect(() => {
  //       //   if (fieldValue && props.selectedDoctor) {
  //       //     businessBookedSlot(fieldValue, appointments, props.selectedDoctor);
  //       //   }
  //       // }, [fieldValue, props.selectedDoctor]);
       
  //     const handleFieldChange = (newValue: Date | undefined) => {
  //       if (!newValue) {
  //         console.error('Selected date is undefined');
  //         return;
  //       }
      
  //     const formattedDate = newValue.toISOString().split('T')[0]; // Convert Date to 'YYYY-MM-DD' format
  //       setFieldValue(formattedDate);
  //       // console.log(fieldValue);
  //       console.log(field.value);
  //       // Assuming `appointments` is available here, pass it along with fieldValue
  //       businessBookedSlot(formattedDate, appointments, props.selectedDoctor);
  //     };
    
  //     const adjustDate = (selectedDate: Date) => {
  //      const adjustedDate = new Date(selectedDate);
  //      adjustedDate.setDate(adjustedDate.getDate() + 1); // Add one day to the selected date
  //     return adjustedDate;
  //   };

  //     const businessBookedSlot = (
  //       fieldValue: string | undefined, 
  //       appointments: Appointment[]| null,
  //       selectedDoctor: string | null| undefined
  //       ) => {
  //         if (!fieldValue) {
  //           console.error('Field value is undefined or empty');
  //           return;
  //         }
        
  //       // Convert field.value into a Date object
  //      const selectedDate = new Date(fieldValue);
  //       const adjustedDate = adjustDate(selectedDate);
  //       console.log(`date originale: ${selectedDate}`)
  //       console.log(`date nuevo: ${adjustedDate}`)
  //       if (isNaN(selectedDate.getTime())) {
  //         console.error('Invalid date');
  //         return;
  //       }
        
        
  //       // Filter appointments for the selected date
  //       if (appointments && appointments.length > 0) {
          
  //      const filteredAppointments = appointments.filter((appointment) => {
  //       console.log(`primaryPhysician: ${appointment.primaryPhysician}` )
  //       console.log(`propdoctor ${selectedDoctor}`)
  //      const appointmentDate = new Date(appointment.schedule);
  //       return appointmentDate.toDateString() === adjustedDate.toDateString()&&
  //        appointment.primaryPhysician === selectedDoctor;
  //       });
       
  //       console.log(`Appointments on ${adjustedDate.toDateString()}:`, filteredAppointments);
        
  // // Map the filteredAppointments to TimeSlot[] format
  //     //  const bookedSlots = filteredAppointments.map((appointment) => ({
  //     //   time: new Date(appointment.schedule).toLocaleTimeString([], {
  //     //   hour: '2-digit',
  //     //   minute: '2-digit',
  //     //  }), // Convert appointment.schedule to the correct time format
  //     // }));

  //     //   setBookedSlot(bookedSlots); // Set the correct format in setBookedSlot

  //     //   return bookedSlots.map(slot => slot.time) || [];
  //     // }
  //     // };


      
  //   // useEffect(() => {
  //   //   getTime();
  //   //   }, []);
    
  //   //     const getTime = () => {
  //   //     const timeList: TimeSlot[] = [];
    
  //   //       for (let i = 10; i <= 12; i++) {
  //   //       timeList.push({ time: i + ":00 AM" });
  //   //       timeList.push({ time: i + ":30 AM" });
  //   //     }
    
  //   //       for (let i = 1; i <= 6; i++) {
  //   //       timeList.push({ time: i + ":00 PM" });
  //   //       timeList.push({ time: i + ":30 PM" });
  //   //     }
    
  //   //     setTimeSlot(timeList);
  //   //   };
    

  //   //   // Function to check if a time slot or its adjacent slots are booked
  //   //   const isBookedOrAdjacent = (time: string, bookedSlots: TimeSlot[], selectedDoctor: string | null | undefined): boolean => {
  //   //     // Convert the time string to a Date object
  //   //     const timeDate = new Date(time);

  //   //     // Find the current time slot
  //   //     const currentTimeSlot = bookedSlots.find(slot => 
  //   //       new Date(slot.time).setHours(0, 0, 0, 0) === timeDate.setHours(0, 0, 0, 0)
  //   //     );
  //   //     console.log(currentTimeSlot)

  //   //     // If the current time slot is booked, return true
  //   //     if (currentTimeSlot) {
  //   //       return true;
  //   //     }

  //   //     // Get the current time in 24-hour format
  //   //     const currentTime = timeDate.getHours();
 
  //   //     // Check if the current time slot is booked
  //   //     const isCurrentBooked = bookedSlots.some(slot => {
  //   //       const slotTime = new Date(slot.time);
  //   //       return slotTime.getHours() === currentTime && 
  //   //             slotTime.getMinutes() === timeDate.getMinutes() &&
  //   //             slotTime.getSeconds() === timeDate.getSeconds();
  //   //     });

  //   //     // If the current time slot is booked, return true
  //   //     if (isCurrentBooked) {
  //   //       return true;
  //   //     }

  //   //     // Check adjacent time slots
  //   //     const adjacentSlots = [
  //   //       { hours: currentTime - 1, minutes: timeDate.getMinutes(), seconds: timeDate.getSeconds() },
  //   //       { hours: currentTime + 1, minutes: timeDate.getMinutes(), seconds: timeDate.getSeconds() }
  //   //     ];

  //   //     return adjacentSlots.some(adjacentTime => {
  //   //       const adjacentDate = new Date();
  //   //       adjacentDate.setHours(adjacentTime.hours, adjacentTime.minutes, adjacentTime.seconds);
  //   //       return bookedSlots.some(slot => {
  //   //         const slotDate = new Date(slot.time);
  //   //         return slotDate.getHours() === adjacentTime.hours &&
  //   //               slotDate.getMinutes() === adjacentTime.minutes &&
  //   //               slotDate.getSeconds() === adjacentTime.seconds;
  //   //       });
  //   //     });
  //   // //   };
  //   //     const handleTimeSlotSelection = (time: string) => {
  //   //      if (!field.value) return; // Ensure a date is selected first
   //   // // Parse the selected date into a Date object
  //   //     const selectedDate = new Date(field.value);
  //   //     const adjustedDate = adjustDate(selectedDate);

  //   //     if (!adjustedDate || isNaN(selectedDate.getTime())) {
  //   //       console.error('Invalid date');
  //   //       return;
  //   //     }
  //   // // Split the selected time into hours and minutes
  //   //     const [timeString, period] = time.split(' ');
  //   //       let [hours, minutes] = timeString.split(':').map(Number);
  
  //   //     // Convert 12-hour format to 24-hour format
  //   //       if (period === 'PM' && hours < 12) {
  //   //         hours += 12;
  //   //       } else if (period === 'AM' && hours === 12) {
  //   //         hours = 0;
  //   //       }

  //   //     // Set hours and minutes to the selectedDate object
  //   //       selectedDate.setHours(hours, minutes);

  //   //     // Update field.value with the combined date and time
  //   //       field.onChange(selectedDate);
  //   //       setSelectedTime(time); // Keep track of the selected time

  //   //     const isDisabled = isBookedOrAdjacent(`${adjustedDate.getFullYear()}-${adjustedDate.getMonth() + 1}-${adjustedDate.getDate()} ${time}`, bookedSlot, props.selectedDoctor);
  //   //     if (isDisabled) {
  //   //       console.log(`Time slot ${time} is disabled`);
  //   //       return;
  //   //     }
  //   //   }; 
  //   //   const [adjustedDate, setAdjustedDate] = useState<Date | null>(null);

  //   //   useEffect(() => {
  //   //     if (field.value) {
  //   //       const selectedDate = new Date(field.value);
  //   //       setAdjustedDate(adjustDate(selectedDate));
  //   //     }
  //   //   }, [field.value]);

  //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  //   const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  
    
  //   const getBookedSlots = (date: Date): TimeSlot[] => {
  //     // In a real application, you would fetch this data from your backend
  //     return [
  //       { time: '11:00 AM', isBooked: true },
  //       { time: '2:00 PM', isBooked: true },
  //       { time: '4:30 PM', isBooked: true },
  //     ];
  //   };

  //   const generateTimeSlots = (): TimeSlot[] => {
  //     const slots: TimeSlot[] = [];
  //     for (let hour = 10; hour <= 18; hour++) {
  //       for (let minute = 0; minute < 60; minute += 30) {
  //         const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  //         const ampm = hour >= 12 ? 'PM' : 'AM';
  //         const formattedTime = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  //         slots.push({ time: formattedTime, isBooked: false });
  //       }
  //     }
  //     return slots;
  //   };

  //   const handleDateSelect = (date: Date | undefined) => {
  //     setSelectedDate(date);
  //     setSelectedTime(undefined);
  //   };
  
  //   const handleTimeSelect = (time: string) => {
  //     setSelectedTime(time);
  //   };
  
  //   const timeSlots = selectedDate ? generateTimeSlots().map(slot => {
  //     const bookedSlots = getBookedSlots(selectedDate);
  //     return {
  //       ...slot,
  //       isBooked: bookedSlots.some(bookedSlot => bookedSlot.time === slot.time)
  //     };
  //   }) : [];


      // return (
      //   <div>
      //     <Sheet>
      //       <SheetTrigger asChild>
      //         <FormControl>
      //       <Button
      //                 variant={"outline"}
      //                 className={cn(
      //                   "w-[33.75rem] h-[44.75px] pl-3 text-left font-normal shad-gray-btn",
      //                   !field.value && "text-muted-foreground"
      //                 )}
      //               >
      //        {field.value?  (
      //      <>
      //    {format(field.value, "PPP h:mm aa")}
      //     </>
      //                ) :(
      //                   <span>Pick a date </span>
      //                 )}
      //                 <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
      //               </Button>
      //               </FormControl>
      //       </SheetTrigger>
      //       <SheetContent className=" h-22 bg-neutral-950  overflow-auto">
      //         <SheetHeader>
      //           <SheetTitle>Book a Service {} </SheetTitle>
      //           <SheetDescription>
      //             Select Date and Time slot to book an service
      //             <div className=" ml-[-12px] flex flex-col gap-5 items-baseline">
      //               <h2 className="mt-5 font-bold">Select Date</h2>
      //               <Calendar
      //         mode="single"
      //         selected={selectedDate}
      //         onSelect={handleDateSelect}
      //         className="rounded-md border"
      //       />

      //             </div>
      //             <h2 className="my-5 font-bold">Select Time Slot</h2>
      //             <div className="grid grid-cols-3 gap-3">
      //             {selectedDate && (
      //       <div className="grid gap-2">
      //         <TimeSlotGrid timeSlots={timeSlots} onSelectTimeSlot={handleTimeSelect} />
      //       </div>
      //     )}
      //             </div>
      //           </SheetDescription>
      //         </SheetHeader>
      //         <SheetFooter className="mt-5">
      //           <SheetClose asChild>
      //             <div className="flex gap-2">
      //               <Button variant="destructive" className=" shad-danger-btn w-24">
      //                       Cancel
      //                     </Button>
          
      //                     <Button className="shad-primary-btn w-24"
      //                       //disabled={(date !(selectedTime && date) || date > new Date() }
                          
      //                     >
      //                       Confirm
      //                     </Button>
      //                   </div>
      //                 </SheetClose>
      //               </SheetFooter>
      //             </SheetContent>
      //           </Sheet>
      //         </div>
            
      // );
      case FormFieldType.DATE_PICKER:

      interface TimeSlot {
        time: string;
        isBooked: boolean;
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

        const [appointments, setAppointments] = useState<Appointment[] | null>(null);
 
 
             // Fetch appointments when the component mounts
        useEffect(() => {
         fetchAppointments();
        }, []); // Empty dependency array ensures this runs only once on mount



    //   console.log(appointments[0]); // Log the first appointment directly
    // } else {
    //   console.log('No appointments available');
    // }
 
 
  const processAppointments = (response: AppointmentResponse | undefined) => {
    if (!response) {
      console.error('Response is undefined');
      return;
    } 


    const {documents} = response;

      console.log(response)
      if (!documents) {
        console.error('Documents array is undefined');
        return;
      }

      // Store individual appointments
        setAppointments(documents); 

    }
    console.log(appointments)
        
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
     
          const getBookedSlots = (date: Date, appointments: Appointment[] | null, selectedDoctor: string | null| undefined): TimeSlot[] => {
            // Filter appointments for the given date
           // const dateString = date.toISOString().split('T')[0];
            const adjustedDate = new Date(date);
          //  console.log(`our adjust ${adjustedDate}`)
            adjustedDate.setDate(adjustedDate.getDate() + 1);
            const dateString = adjustedDate.toISOString().split('T')[0];
           // console.log(`New ${dateString}`)
            const appointmentsForDate = appointments?.filter(appt => 
              appt.schedule.startsWith(dateString)&& appt.primaryPhysician === selectedDoctor
            );
            //console.log(`here's the ${appointmentsForDate}`)
            // Create a map of booked times
            const bookedSlots: TimeSlot[] = (appointmentsForDate || []).map(appt => {
              const apptTime = new Date(appt.schedule);
              return {
                time: apptTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase(),
                isBooked: true
              };
            });
          // console.log(bookedSlots)
            return bookedSlots;
          };
        
      const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
      const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
      const [updatedTimeSlots, setUpdatedTimeSlots] = useState<TimeSlot[]>([]);
        const generateTimeSlots = (): TimeSlot[] => {
          const slots: TimeSlot[] = [];
          for (let hour = 10; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const formattedTime = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${ampm}`;
              slots.push({ time: formattedTime, isBooked: false });
            }
          }
          return slots;
        };
      const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined);
        if (date) {
          field.onChange(date);
        }
      };
    // const [selectedDoctor, setSelectedDoctor] = useState<string | undefined | null>(null);
     // const [selectedDoctor, setSelectedDoctor] = useState<string | undefined | null>(props.selectedDoctor);

      // useEffect(() => {
      //   //setSelectedDoctor(props.selectedDoctor);
      //   setSelectedDate(undefined);
      //   setSelectedTime(undefined);
      // }, [props.selectedDoctor]);
      
      // useEffect(() => {
      //   setSelectedDate(undefined);
      //   setSelectedTime(undefined);
      // }, [selectedDoctor]);
    
     // console.log(`Daktari ${props.selectedDoctor}`)

      useEffect(() => {
        
        if (selectedDate && props.selectedDoctor) {
          const bookedSlots = getBookedSlots(selectedDate, appointments, props.selectedDoctor);
          const updatedTimeSlots = generateTimeSlots().map(slot => ({
            ...slot,
            isBooked: bookedSlots.some(bookedSlot => bookedSlot.time === slot.time)
          }));
          setUpdatedTimeSlots(updatedTimeSlots);
        }
      }, [selectedDate, props.selectedDoctor, appointments]);
      
      const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        console.log(`time ${selectedTime}`)
      
        if (selectedDate && time) {
          const dateObject = new Date(selectedDate);
          const [timeString, period] = time.split(' ');
          let [hours, minutes] = timeString.split(':').map(Number);
      
          if (period === 'PM' && hours < 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }
      
          dateObject.setHours(hours, minutes);
          field.onChange(dateObject);
      
          // Update timeSlots to reflect the selection
          const updatedTimeSlots = timeSlots.map(slot => ({
            ...slot,
            disabled: slot.isBooked || slot.time === time
          }));
      
          // You might need to create a new state for updatedTimeSlots
          setUpdatedTimeSlots(updatedTimeSlots);
        }
      };
    
      const timeSlots = selectedDate ? generateTimeSlots().map(slot => {
        const bookedSlots = getBookedSlots(selectedDate, appointments, props.selectedDoctor);
        return {
          ...slot,
          isBooked: bookedSlots.some(bookedSlot => bookedSlot.time === slot.time)
        };
      }) : [];

      return (
      
    <Sheet>
     
    <SheetTrigger asChild>
      
      <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {props.selectedDoctor && selectedDate && selectedTime ? format(selectedDate, 'PPP') + ' at ' + selectedTime : 'Book a Service'}
      </Button>
    </SheetTrigger>
    <SheetContent className="sm:max-w-[425px]">
      <SheetHeader>
        <SheetTitle>Book a Service</SheetTitle>
        <SheetDescription>Select Date and Time slot to book a service</SheetDescription>
      </SheetHeader>
      <FormControl>     
        <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </div>
        {selectedDate && (
          <div className="grid gap-2">
            <TimeSlotGrid 
              timeSlots={updatedTimeSlots.length > 0 ? updatedTimeSlots : timeSlots} 
              onSelectTimeSlot={handleTimeSelect} 
            />
          </div>
        )}
      </div>
      </FormControl>
 
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit" disabled={!selectedDate || !selectedTime}>Confirm Booking</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
     
  </Sheet>
              
      )
    
     case FormFieldType.SALECT:
      
      return (
        <FormControl>
          <InlineExpandingSelect
            options={props.options || []}
            value={field.value}
            onChange={(option) => {
              field.onChange(option.value);
              if (props.onValueChange) {
                props.onValueChange(option.value);
              }
            }}
            placeholder={props.placeholder || ''}
          />
        </FormControl>
      );
         
    

    // case FormFieldType.SELECT:
    //   return (
    //     <FormControl>
    //       <Select 
    //        onValueChange={(value) => {
    //         field.onChange(value);
    //         if (props.onValueChange) {
    //           props.onValueChange(value);
    //         }
    //       }} 
    //       defaultValue={field.value}
    //     >
    //                     <FormControl>
    //           <SelectTrigger className="shad-select-trigger">
    //             <SelectValue placeholder={props.placeholder} />
    //           </SelectTrigger>
    //         </FormControl>
    //         <SelectContent className="shad-select-content">
    //           {props.children}
    //         </SelectContent>
    //       </Select>
    //     </FormControl>
    //   );


    case FormFieldType.SELECT:
      return (
        <FormControl>
          <InlineExpandingSelect
            options={props.options || []}
            value={field.value}
            onChange={(option) => {
              field.onChange(option.value);
              if (props.onValueChange) {
                props.onValueChange(option.value);
              }
            }}
            placeholder={props.placeholder || ''}
          />
        </FormControl>
      );

          case FormFieldType.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null;
          default:
            return null;
        }
      };

      const CustomFormField = (props: CustomProps) => {
      const { control, name, label, doctorValue } = props;

        return (
          
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex-1">
                {props.fieldType !== FormFieldType.CHECKBOX && label && (
                  <FormLabel className="shad-input-label">{label}</FormLabel>
                )}
                <RenderInput field={field} props={props} 
                
                />

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
