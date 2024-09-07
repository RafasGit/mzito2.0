import React from 'react';
import { Button } from '@/components/ui/button';


interface TimeSlot {
    time: string;
    isBooked: boolean;
  }
  
interface TimeSlotGridProps {
    timeSlots: TimeSlot[];
    onSelectTimeSlot: (time: string) => void;
  }

  const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ timeSlots, onSelectTimeSlot }) => {
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
            key={slot.time}
            onClick={() => onSelectTimeSlot(slot.time)}
            disabled={isSlotDisabled(index)}
            variant="outline"
            className={`w-full py-2 ${
              isSlotDisabled(index) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'
            }`}
          >
            {slot.time}
          </Button>
        ))}
      </div>
    );
  };
  
  export default TimeSlotGrid;