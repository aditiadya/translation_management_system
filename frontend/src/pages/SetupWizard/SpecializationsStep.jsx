import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const SpecializationsStep = ({ onNext, onBack }) => {
  const [specializations, setSpecializations] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const res = await api.get("/admin-specializations");
      setSpecializations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validateSpec = (name) => {
    if (!name || name.trim() === "") {
      return "Specialization name is required";
    }
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!regex.test(name)) {
      return "Invalid specialization name";
    }
    return "";
  };

  const handleAdd = async () => {
    const validationError = validateSpec(newSpec);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin-specializations", {
        name: newSpec,
        active_flag: true,
      });
      setSpecializations([...specializations, res.data]);
      setNewSpec("");
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (spec) => {
    setEditId(spec.id);
    setEditValue(spec.name);
    setEditActive(spec.active_flag);
    setError("");
  };

  const handleUpdate = async (id) => {
    const validationError = validateSpec(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.put(`/admin-specializations/${id}`, {
        name: editValue,
        active_flag: editActive,
      });
      setSpecializations(
        specializations.map((s) => (s.id === id ? res.data : s))
      );
      setEditId(null);
      setEditValue("");
      setEditActive(true);
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-specializations/${id}`);
      setSpecializations(specializations.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const canNext = specializations.length > 0;

  return (
    <div
      className="flex flex-col bg-white shadow-md rounded-lg"
      style={{ width: "800px", height: "400px" }}
    >
      {/* Top: Heading + Form */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Specializations</h2>

        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Enter specialization name"
            className={`flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={newSpec}
            onChange={(e) => setNewSpec(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Middle: Scrollable list */}
      <div className="flex-1 overflow-y-auto p-4">
        {specializations.length === 0 ? (
          <p className="text-gray-500">No specializations added yet.</p>
        ) : (
          <ul className="space-y-2">
            {specializations.map((spec) => (
              <li
                key={spec.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                {editId === spec.id ? (
                  <div className="flex flex-1 gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex w-3/4 p-2 border rounded-md"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                      Active
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>{spec.name}</span>
                    <span
                      className={`text-sm ${
                        spec.active_flag ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {spec.active_flag ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="space-x-2">
                  {editId === spec.id ? (
                    <button
                      onClick={() => handleUpdate(spec.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(spec)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(spec.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom: Navigation buttons */}
      <div className="p-4 border-t flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canNext}
          className={`px-6 py-2 rounded ${
            !canNext
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SpecializationsStep;
