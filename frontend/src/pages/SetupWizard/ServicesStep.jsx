import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const ServicesStep = ({ onNext, onBack }) => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/admin-services");
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validateService = (name) => {
    if (!name || name.trim() === "") {
      return "Service name is required";
    }
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!regex.test(name)) {
      return "Invalid service name";
    }
    return "";
  };

  const handleAdd = async () => {
    const validationError = validateService(newService);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin-services", {
        name: newService,
        active_flag: true,
      });
      setServices([...services, res.data.data]);
      setNewService("");
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.id);
    setEditValue(service.name);
    setEditActive(service.active_flag);
    setError("");
  };

  const handleUpdate = async (id) => {
    const validationError = validateService(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.put(`/admin-services/${id}`, {
        name: editValue,
        active_flag: editActive,
      });
      setServices(services.map((s) => (s.id === id ? res.data.data : s)));
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
      await api.delete(`/admin-services/${id}`);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const canNext = services.length > 0;

  return (
    <div
      className="flex flex-col bg-white shadow-md rounded-lg"
      style={{ width: "800px", height: "400px" }} 
    >
      {/* Top: Heading + Form */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Services</h2>

        <div className="flex mb-2">
          <input
            type="text"
            placeholder="Enter service name"
            className={`flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
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
        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          <ul className="space-y-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                {editId === service.id ? (
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
                    <span>{service.name}</span>
                    <span
                      className={`text-sm ${
                        service.active_flag
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {service.active_flag ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="space-x-2">
                  {editId === service.id ? (
                    <button
                      onClick={() => handleUpdate(service.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(service.id)}
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

export default ServicesStep;