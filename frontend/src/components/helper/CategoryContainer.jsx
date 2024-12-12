import React, { useId, forwardRef } from "react";
import { GripVertical, X } from "lucide-react";

const CategoryContainer = forwardRef(function ({ text, Classname, onClick }, ref) {
  const id = useId();

  return (
    <div
      className={`w-full text-lg flex space-x-2 items-center  ${Classname}`}
      key={id}
    >
      <GripVertical className="text-primary-color cursor-grab"/>
      <div className="border rounded-md px-4 py-1 text-gray-500 min-w-32">{text}</div>
      <div onClick={onClick}>
      <X className="text-primary-color border border-gray-500 rounded-md p-1"/>
      </div>
    </div>
    
  );
});

export default CategoryContainer;
