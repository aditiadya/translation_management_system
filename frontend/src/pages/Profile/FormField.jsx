import React from "react";
import { getTimezonesWithOffset } from "../../utils/constants/timezones";
import { getEmailLanguages } from "../../utils/constants/languages";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

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
    let value = isEditing ? formData[fieldKey] ?? "" : admin[fieldKey] ?? "-";

    if (fieldKey === "createdAt" || fieldKey === "updatedAt") {
      value = value ? formatDateTime(value) : "-";
    }

    // Capitalize gender for display in view mode
    if (!isEditing && fieldKey === "gender" && value && value !== "-") {
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    if (readOnly) {
      return (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-gray-800 bg-gray-50 rounded-md w-3/4 p-2.5">
            {value}
          </p>
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
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="">Select {label}</option>
              {fieldKey === "gender" && (
                <>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </>
              )}

              {fieldKey === "language_email" &&
                getEmailLanguages().map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))
              }

              {fieldKey === "time_zone" && (
                <>
                  <option value="">Select Timezone</option>
                  {getTimezonesWithOffset().map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          ) : (
            <input
              type="text"
              name={fieldKey}
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
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