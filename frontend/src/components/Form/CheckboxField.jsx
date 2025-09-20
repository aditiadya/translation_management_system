const CheckboxField = ({ label, name, checked, onChange }) => (
  <div>
    <label className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      {label}
    </label>
    <p className="text-gray-500 text-sm mt-1">
      If checked, the system will send an invitation email.
    </p>
  </div>
);

export default CheckboxField;