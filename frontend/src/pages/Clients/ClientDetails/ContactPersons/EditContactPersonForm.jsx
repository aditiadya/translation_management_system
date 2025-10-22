import { useState, useEffect } from "react";

const EditContactPersonForm = ({ person, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...person });

  useEffect(() => {
    setFormData({ ...person });
  }, [person]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(person.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Edit Contact Person
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Teams ID</label>
            <input
              type="text"
              name="teams_id"
              value={formData.teams_id || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Zoom ID</label>
            <input
              type="text"
              name="zoom_id"
              value={formData.zoom_id || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2 mt-1"
            ></textarea>
          </div>

          <div className="col-span-2 flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={!!formData.is_active}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Is Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_invoicing"
                checked={!!formData.is_invoicing}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Is Invoicing</span>
            </label>
          </div>

          <div className="col-span-2 flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactPersonForm;