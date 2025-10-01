import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const PaymentMethodStep = ({ onNext, onBack }) => {
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({
    name: "",
    payment_type: "",
    bank_info: "",
    description: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/admin/payment-methods");
      setMethods(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validateMethod = (method) => {
    if (!method.name || method.name.trim() === "") {
      return "Name is required";
    }
    if (!method.payment_type || method.payment_type.trim() === "") {
      return "Payment type is required";
    }
    return "";
  };

  const handleAdd = async () => {
    const validationError = validateMethod(newMethod);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin/payment-methods", newMethod);
      setMethods([...methods, res.data.data]);
      setNewMethod({
        name: "",
        payment_type: "",
        bank_info: "",
        description: "",
        active: true,
      });
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (method) => {
    setEditId(method.id);
    setEditValue({ ...method });
    setError("");
  };

  const handleUpdate = async (id) => {
    const validationError = validateMethod(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.put(`/admin/payment-methods/${id}`, editValue);
      setMethods(methods.map((m) => (m.id === id ? res.data.data : m)));
      setEditId(null);
      setEditValue(null);
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/payment-methods/${id}`);
      setMethods(methods.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const canNext = methods.length > 0;

  return (
    <div
      className="flex flex-col bg-white shadow-md rounded-lg"
      style={{ width: "800px", height: "400px" }}
    >
      {/* Top: Heading + Form */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Payment Methods
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border rounded col-span-1"
            value={newMethod.name}
            onChange={(e) =>
              setNewMethod({ ...newMethod, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Payment Type (e.g., UPI, Bank Transfer)"
            className="p-2 border rounded col-span-1"
            value={newMethod.payment_type}
            onChange={(e) =>
              setNewMethod({ ...newMethod, payment_type: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Bank Info"
            className="p-2 border rounded col-span-2"
            value={newMethod.bank_info}
            onChange={(e) =>
              setNewMethod({ ...newMethod, bank_info: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            className="p-2 border rounded col-span-2"
            value={newMethod.description}
            onChange={(e) =>
              setNewMethod({ ...newMethod, description: e.target.value })
            }
          />
          
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Add
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Middle: Scrollable list */}
      <div className="flex-1 overflow-y-auto p-4">
        {methods.length === 0 ? (
          <p className="text-gray-500">No payment methods added yet.</p>
        ) : (
          <ul className="space-y-2">
            {methods.map((method) => (
              <li
                key={method.id}
                className="flex flex-col border p-3 rounded-md"
              >
                {editId === method.id ? (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <input
                      type="text"
                      value={editValue.name}
                      onChange={(e) =>
                        setEditValue({ ...editValue, name: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={editValue.payment_type}
                      onChange={(e) =>
                        setEditValue({
                          ...editValue,
                          payment_type: e.target.value,
                        })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={editValue.bank_info}
                      onChange={(e) =>
                        setEditValue({
                          ...editValue,
                          bank_info: e.target.value,
                        })
                      }
                      className="p-2 border rounded col-span-2"
                    />
                    <textarea
                      value={editValue.description}
                      onChange={(e) =>
                        setEditValue({
                          ...editValue,
                          description: e.target.value,
                        })
                      }
                      className="p-2 border rounded col-span-2"
                    />
                    <div className="flex items-center col-span-2">
                      <input
                        type="checkbox"
                        checked={editValue.active}
                        onChange={(e) =>
                          setEditValue({
                            ...editValue,
                            active: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label>Active</label>
                    </div>
                    <div className="col-span-2 flex space-x-2">
                      <button
                        onClick={() => handleUpdate(method.id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{method.name}</p>
                      
                      <p
                        className={`text-sm font-medium ${
                          method.active ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {method.active ? "Active" : "Inactive"}
                      </p>
                    </div>

                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
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
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;