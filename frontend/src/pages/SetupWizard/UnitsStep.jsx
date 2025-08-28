import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const UnitsStep = ({ onNext, onBack }) => {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await api.get("/admin-units");
      setUnits(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validateUnit = (name) => {
    if (!name || name.trim() === "") {
      return "Unit name is required";
    }
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!regex.test(name)) {
      return "Invalid unit name";
    }
    return "";
  };

  const handleAdd = async () => {
    const validationError = validateUnit(newUnit);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin-units", {
        name: newUnit,
        active_flag: true,
        is_word: true,
      });
      setUnits([...units, res.data.data]);
      setNewUnit("");
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (unit) => {
    setEditId(unit.id);
    setEditValue(unit.name);
    setEditActive(unit.active_flag);
    setError("");
  };

  const handleUpdate = async (id) => {
    const validationError = validateUnit(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.put(`/admin-units/${id}`, {
        name: editValue,
        active_flag: editActive,
      });
      setUnits(units.map((u) => (u.id === id ? res.data.data : u)));
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
      await api.delete(`/admin-units/${id}`);
      setUnits(units.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const canNext = units.length > 0;

  return (
    <div
      className="flex flex-col bg-white shadow-md rounded-lg"
      style={{ width: "800px", height: "400px" }}
    >
      {/* Top: Heading + Form */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Units</h2>

        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Enter unit name"
            className={`flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
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
        {units.length === 0 ? (
          <p className="text-gray-500">No units added yet.</p>
        ) : (
          <ul className="space-y-2">
            {units.map((unit) => (
              <li
                key={unit.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                {editId === unit.id ? (
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
                    <span>{unit.name}</span>
                    <span
                      className={`text-sm ${
                        unit.active_flag ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {unit.active_flag ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="space-x-2">
                  {editId === unit.id ? (
                    <button
                      onClick={() => handleUpdate(unit.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(unit)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(unit.id)}
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

export default UnitsStep;
