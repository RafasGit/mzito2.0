import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import Image from 'next/image';

interface SelectOption {
    value: string;
    label: string;
    image?: string | undefined;
    amount?: string;
   duration?: string
  }

interface InlineExpandingSelectProps {
    options: SelectOption[];
    value: string | null;
    onChange: (option: SelectOption) => void;
    placeholder: string;
  }

const InlineExpandingSelect: React.FC<InlineExpandingSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

     
    return (
      <div className=" relative w-full">
        <div
          className="cursor-pointer mt-4 flex items-center justify-between w-full p-2 bg-stone-900 border-b-4 border-b-stone-800 rounded-md shadow-sm focus:outline-none"
          onClick={handleToggle}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {isOpen && (
          <div className="mt-1 bg-stone-900  border-b-gray-300 rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option.label}
                onClick={() => handleSelect(option)}
                className="flex items-center p-2 cursor-pointer hover:bg-stone-800"
              >
                <div className=" text-white p-4 rounded-lg w-[32rem] lg:w-[49rem] border-b-2 border-b-stone-800">
                   <div className="text-base mb-1 flex items-center">
                    
                     <Image
                      src={typeof option.image === 'string' ? option.image : option?.image || ''}
                      height={100}
                      width={100}
                      alt="Mzito SuperCuts"
                      className="mb-0 h-10 w-fit bg-neutral-50 rounded-2xl"
                     />
                     <span className="ml-4"> {option.label}</span>
                   </div>
                   <div className="flex items-center space-x-4 ml-16 ">
                     <div className="text-sm text-gray-400">{option?.duration}</div>
                     <div className="text-sm">{option?.amount}</div>
                   </div>
                </div>
                {selectedOption?.label === option?.label && <Check className="w-6 h-6 text-blue-500" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
}
export default InlineExpandingSelect;
