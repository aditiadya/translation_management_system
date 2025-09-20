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
    <label className="block text-gray-700 font-bold mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
        error ? "border-red-500" : "border-gray-300"
      } focus:shadow-outline`}
      required={required}
    />
    <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{error || ""}</p>
  </div>
);
export default FormInput;