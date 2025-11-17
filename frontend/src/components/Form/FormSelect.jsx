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
  disabled = false,
  ...props
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>

    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`border rounded-lg w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2
          ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}
          appearance-none pr-10
          ${disabled ? "bg-gray-200 cursor-not-allowed text-gray-500" : "bg-white"}
        `}
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
        size={18}
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
          disabled ? "text-gray-400" : "text-gray-500"
        }`}
      />
    </div>

    <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{error || ""}</p>
  </div>
);

export default FormSelect;