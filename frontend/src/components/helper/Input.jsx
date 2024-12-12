
import React, {useId, forwardRef} from 'react'


const Input = forwardRef(function({
  label,
  isImportant,
  type = "text",
  ClassName= "",
  placeholder = "Enter Your text.....",
  ...props
}, ref){
   const id = useId();

   return (
    <div className='w-full'>
  {
    label && <div 
    className=' mb-3 pl-1 text-xl text-primary-color'
    htmlFor={id}>
      {label} {isImportant && <span className="text-red-500">*</span>}
    </div>
    
  }
  <input
   type={type}
   id={id}
   placeholder={placeholder}
   className = {`shadow appearance-none border rounded-xl w-[100%] h-11 py-2 px-3 text-primary-color leading-tight focus:outline-none focus:shadow-outline ${ClassName} `}
   {...props}
   ref={ref}
  />
</div>
   )
})


export default Input;