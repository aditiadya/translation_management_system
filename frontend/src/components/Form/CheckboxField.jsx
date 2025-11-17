const CheckboxField = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  hint = "If checked, the system will send an invitation email." 
}) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2 h-4 w-4"
      />
      {label}
    </label>
    {hint && <p className="text-gray-500 text-sm mt-1">{hint}</p>}
  </div>
);

export default CheckboxField;