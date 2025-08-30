import React from "react";

const FormField = React.memo(
  ({
    fieldKey,
    label,
    type = "text",
    required = false,
    readOnly = false,
    isEditing,
    formData,
    admin,
    handleChange,
  }) => {
    const value = isEditing ? formData[fieldKey] ?? "" : admin[fieldKey] ?? "-";

    if (readOnly) {
      return (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-gray-800  bg-gray-50 rounded-md w-3/4 p-2.5">{value}</p>
        </div>
      );
    }

    return (
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          type === "select" ? (
            <select
              name={fieldKey}
              value={fieldKey === "gender" ? value?.toLowerCase() : value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="">Select {label}</option>
              {fieldKey === "gender" && (
                <>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </>
              )}
              {fieldKey === "language_email" && (
                <>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </>
              )}
              {fieldKey === "time_zone" && (
                <>
                  <option value="IST">India Standard Time (IST)</option>
                  <option value="PST">Pacific Standard Time (PST)</option>
                  <option value="EST">Eastern Standard Time (EST)</option>
                </>
              )}
            </select>
          ) : (
            <input
              type="text"
              name={fieldKey}
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder={`Your ${label}`}
            />
          )
        ) : (
          <p className="text-gray-800 bg-gray-50 rounded-md w-3/4 p-2.5">
            {value}
          </p>
        )}
      </div>
    );
  }
);

export default FormField;
