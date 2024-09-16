import React from 'react';
import { Button } from '@/components/ui/button';


interface TimeSlot {
    time: string;
    isBooked: boolean;
    disabled?: boolean;
  }
  
interface TimeSlotGridProps {
    timeSlots: TimeSlot[];
    onSelectTimeSlot: (time: string) => void;
    selectedTime?: string;
  }

  const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ timeSlots, onSelectTimeSlot, selectedTime }) => {
    const isSlotDisabled = (index: number): boolean => {
      if (timeSlots[index].isBooked) return true;
      if (index > 0 && timeSlots[index - 1].isBooked) return true;
      if (index < timeSlots.length - 1 && timeSlots[index + 1].isBooked) return true;
      return false;
    };
  
    return (
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot, index) => (
          <Button
           type='button'
            key={slot.time}
            onClick={() => onSelectTimeSlot(slot.time)}
            disabled={isSlotDisabled(index)}
            variant="outline"
            className={`w-full  rounded-xl border-neutral-700 ${
              isSlotDisabled(index) ? 'opacity-0 cursor-not-allowed' :
              slot.time === selectedTime
                ? 'bg-[hsl(36,61%,58%)] text-black' :
              'hover:bg-neutral-700 hover:text-white'
            } `}
          >
            {slot.time}
          </Button>
        ))}
      </div>
    );
  };
  
  export default TimeSlotGrid;