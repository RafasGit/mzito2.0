import React from 'react';

interface SelectItemProps {
  value: string;
  onClick?: (value: string) => void; // Callback when the item is clicked
  children: React.ReactNode; // Content to be rendered inside the select item (like name, image, etc.)
}

const Option: React.FC<SelectItemProps> = ({ value, onClick, children }) => {
  const handleClick = () => {
    if (onClick) onClick(value);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center p-2 cursor-pointer hover:bg-stone-800"
    >
      {children} {/* This will allow for custom rendering (e.g., image, text) */}
    </div>
  );
};

export default Option;