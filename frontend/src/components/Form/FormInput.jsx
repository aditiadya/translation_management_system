const FormInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`border rounded-lg w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 
        ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}
      `}
    />

    <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{error || ""}</p>
  </div>
);

export default FormInput;