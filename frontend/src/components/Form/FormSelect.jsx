import { ChevronDown } from "lucide-react";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  required = false,
  disabled = false, // add disabled prop
  ...props
}) => (
  <div>
    <label htmlFor={name} className="block text-gray-700 font-bold mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled} // <-- make it work
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none 
          ${error ? "border-red-500" : "border-gray-300"} 
          focus:shadow-outline appearance-none pr-10
          ${disabled ? "bg-gray-200 cursor-not-allowed text-gray-500" : "bg-white"}
        `}
        required={required}
        {...props}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((opt) => ( 
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${disabled ? "text-gray-400" : "text-gray-500"}`}
      />
    </div>

    <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{error || ""}</p>
  </div>
);

export default FormSelect;