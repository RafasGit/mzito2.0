import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  label?: string;
  placeholder?: string;
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

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
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
      }


     
      const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
      const [bookedSlot, setBookedSlot] = useState([]);
      const [selectedTime, setSelectedTime] = useState<string>();

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
          timeList.push({
            time: i + ":00 AM",
          });
          timeList.push({
            time: i + ":30 AM",
          });
        }
        for (let i = 1; i <= 6; i++) {
          timeList.push({
            time: i + ":00 PM",
          });    
          timeList.push({
            time: i + ":30 PM",
          });
        }
    
        setTimeSlot(timeList);
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
                <SheetTitle>Book a Service</SheetTitle>
                <SheetDescription>
                  Select Date and Time slot to book an service
                  <div className=" ml-[-12px] flex flex-col gap-5 items-baseline">
                    <h2 className="mt-5 font-bold">Select Date</h2>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border pl-2"
                    />
                  </div>
                  <h2 className="my-5 font-bold">Select Time Slot</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlot.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                       // disabled={isBooked(item.time) || prevDate >= date } 
                        className={`border rounded-full p-2 px-3 hover:bg-black hover:text-white ${
                          selectedTime == item.time && "bg-white text-black"
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