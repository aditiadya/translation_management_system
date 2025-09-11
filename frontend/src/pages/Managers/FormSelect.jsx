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
}) => (
  <div className="relative">
    <label className="block text-gray-700 font-bold mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
        error ? "border-red-500" : "border-gray-300"
      } focus:shadow-outline appearance-none pr-10`}
      required={required}
    >
      <option value="">{`Select ${label}`}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
    <ChevronDown
      size={20}
      className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
    <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{error || ""}</p>
  </div>
);

export default FormSelect;