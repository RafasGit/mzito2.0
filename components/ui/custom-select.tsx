// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Check } from 'lucide-react';
// import Image from 'next/image';
// import { Button } from './button';

// interface Option {
//   image: string;
//   name: string;
//   amount?: string;
//   duration?: string; 
// }

// interface CustomSelectProps {
//   options: Option[];
//   //defaultValue?: Option;
//   onChange?: (selectedOption: Option) => void;
//   placeholder?: String | null;
//   children?: React.ReactNode | Option[]; 
// }

// const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange, placeholder }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [selectedOption, setSelectedOption] = useState<Option>();
//   const toggleSelect = (): void => setIsOpen(!isOpen);

//   const handleOptionClick = (option: Option): void => {
//     setSelectedOption(option);
//     console.log(`doc ${selectedOption}`)
//     setIsOpen(false);
//     if (onChange) onChange(option);
    
//     //console.log(placeholder)

//   };

//   return (
//     <div className="relative w-full">
//       <Button
//       type='button'
//         onClick={toggleSelect}
//         className="mt-4 flex items-center justify-between w-full p-2 bg-stone-900 border-b-4 border-b-stone-800 rounded-md shadow-sm focus:outline-none  "
       
//       >
//         { selectedOption && selectedOption!== undefined ? 
//           (
           
//             <div className="text-base mb-1 flex items-center">
//             {/* <img src="/assets/icons/IMG_2057.svg" alt="" /> */}
//             <Image
//               src={selectedOption.image}
//               height={100}
//               width={100}
//               alt="Mzito SuperCuts"
//               className="mb-0 h-10 w-fit bg-neutral-50 rounded-2xl"
//             />
//             <span className="ml-4"> {selectedOption.name}</span>
//             <span className="ml-4"> {selectedOption.amount}</span>
//           </div>
//           ) : (
//             <span>{placeholder}</span>
//           )
        
//         }

//         {isOpen ? (<ChevronUp className="w-4 h-4" /> 
//         )
//         : (<ChevronDown className="w-4 h-4" />)
//       }
//       </Button>
//       {isOpen && (
//         <div className="mt-1 bg-stone-900  border-b-gray-300 rounded-md shadow-lg">
//           {options.map((option) => (
//             <div
//               key={option.name}
//               onClick={() => handleOptionClick(option)}
//               className="flex items-center p-2 cursor-pointer hover:bg-stone-800"
//             >
//               {/* <span className="flex-grow">{option.name}</span>
//               <span className="flex-grow">{option.name}</span> */}
//                <div className=" text-white p-4 rounded-lg w-100 border-b-2 border-b-stone-800">
//                   <div className="text-base mb-1 flex items-center">
//                     {/* <img src="/assets/icons/IMG_2057.svg" alt="" /> */}
//                     <Image
//                       src={option.image}
//                       height={100}
//                       width={100}
//                       alt="Mzito SuperCuts"
//                       className="mb-0 h-10 w-fit bg-neutral-50 rounded-2xl"
//                     />
//                     <span className="ml-4"> {option.name}</span>
//                   </div>
//                   <div className="flex items-center space-x-4 ml-16 ">
//                     <div className="text-sm text-gray-400">{option.duration}</div>
//                     <div className="text-sm">{option.amount}</div>
//                   </div>
//               </div>
//               {selectedOption?.name === option.name && <Check className="w-4 h-4 text-blue-500" />}
//             </div>
//           ))}
//         </div>
        
//       )}
//     </div>
//   );
// };

// export default CustomSelect;
//  {/* {Doctors.map((doctor, i) => (
//                 <SelectItem key={doctor.name + i} value={doctor.name}>
//                   <div className="flex cursor-pointer items-center gap-2">
//                     <Image
//                       src={doctor.image}
//                       width={32}
//                       height={32}
//                       alt="doctor"
//                       className="rounded-full border border-dark-500"
//                     />
//                     <p>{doctor.name}</p>
//                   </div>
//                 </SelectItem> */}
//         {/* /      ))} */}
                

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';

interface Option {
  image: string;
  name: string;
  amount?: string;
  duration?: string; 
}

interface CustomSelectProps {
  options?: Option[];
  onChange?: (selectedOption: Option) => void;
  placeholder?: string | null;
  children?: React.ReactNode;  // Accepts children for custom rendering
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange, placeholder, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const toggleSelect = (): void => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option): void => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative w-full">
      <Button
        type="button"
        onClick={toggleSelect}
        className="mt-4 flex items-center justify-between w-full p-2 bg-stone-900 border-b-4 border-b-stone-800 rounded-md shadow-sm focus:outline-none"
      >
        {selectedOption ? (
          <div className="text-base mb-1 flex items-center">
            <Image
              src={selectedOption.image}
              height={32}
              width={32}
              alt="Selected option"
              className="mb-0 h-10 w-fit bg-neutral-50 rounded-2xl"
            />
            <span className="ml-4">{selectedOption.name}</span>
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </Button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg">
          {/* Render children here using React.Children */}
          {React.Children.map(children, (child) => (
            <div className="p-2 hover:bg-stone-800">{child}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;