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
  type?: "schedule" | "create";
  apptValue?: any;
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
      //  console.log(appointments)
        
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
      //  console.log(`time ${selectedTime}`)
      
        if (selectedDate && time) {
        
            setIsSheetOpen(false);   
        
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

      const [isSheetOpen, setIsSheetOpen] = useState(false);

     

      return (
      
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
     
    <SheetTrigger asChild>
      
    <Button type="button" variant="outline" className="w-full justify-start text-left font-normal text-md">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {props.type === "create" ? (
    props.selectedDoctor && selectedDate && selectedTime 
      ? format(selectedDate, 'PPP') + ' at ' + selectedTime 
      : 'Book a Service'
  ) : props.type === "schedule" ? (
    props.apptValue 
      ? format(props.apptValue, 'PPP') + ' at ' + format(props.apptValue, 'h:mm aa')
      : (selectedDate && selectedTime 
        ? 'New: ' + format(selectedDate, 'PPP') + ' at ' + selectedTime
        : 'Reschedule Appointment')
  ) : (
    'Invalid Type'
  )}
 
      </Button>
    </SheetTrigger>
    <SheetContent className="sm:max-w-[425px]">
      <SheetHeader>
         <SheetDescription className="mt-6 mb-6 text-xl sm:mt-10 sm:mb-6 sm:text-2xl">Select Date and Time to book a service</SheetDescription> 
      </SheetHeader>
      <FormControl>     
        <div className="grid gap-4 py-4">
        <div className="grid gap-2 ml-[-26px] mt-[-30px] sm:ml-0 sm:mt-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date();
              const oneWeekFromNow = new Date(today.setHours(0,0,0,0) + 7 * 24 * 60 * 60 * 1000);
              return date < today || date.getTime() > oneWeekFromNow.getTime();
            }}
            className="rounded-md "
          />
        </div>
        {selectedDate && (
          <div className="grid gap-2 sm:mt-0 mt-[-28px] ml-[-14px] mr-4">
            <TimeSlotGrid 
              timeSlots={updatedTimeSlots.length > 0 ? updatedTimeSlots : timeSlots} 
              onSelectTimeSlot={handleTimeSelect} 
              selectedTime={selectedTime}
            />
          </div>
        )}
      </div>
      </FormControl>
 
      <SheetFooter>
        <SheetClose asChild>
          {/* <Button  
          type="submit" disabled={!selectedDate || !selectedTime}
          className="border border-stone-800 rounded-lg hover:bg-[hsl(36,61%,58%)] sm: mt-[-4px] ml-[-4px]">
            Confirm Booking
          </Button> */}
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
