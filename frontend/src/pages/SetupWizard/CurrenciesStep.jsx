import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const CurrenciesStep = ({ onNext, onBack }) => {
  const [currencies, setCurrencies] = useState([]);
  const [userCurrencies, setUserCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCurrency, setEditCurrency] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await api.get("/currencies");
        setCurrencies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrencies();
  }, []);

  const fetchUserCurrencies = async () => {
    try {
      const res = await api.get("/admin-currencies");
      setUserCurrencies(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserCurrencies();
  }, []);

  const handleAdd = async () => {
    if (!selectedCurrency) {
      setError("Please select a currency.");
      return;
    }
    try {
      await api.post("/admin-currencies", {
        currencyId: selectedCurrency,
        active_flag: true,
      });
      setSelectedCurrency("");
      setError("");
      fetchUserCurrencies();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add currency");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-currencies/${id}`);
      fetchUserCurrencies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (currency) => {
    setEditId(currency.id);
    setEditCurrency(currency.currencyId);
    setEditActive(currency.active_flag);
    setError("");
  };

  const handleUpdate = async (id) => {
    if (!editCurrency) {
      setError("Please select a currency.");
      return;
    }
    try {
      await api.put(`/admin-currencies/${id}`, {
        currencyId: editCurrency,
        active_flag: editActive,
      });
      setEditId(null);
      setEditCurrency("");
      setEditActive(true);
      setError("");
      fetchUserCurrencies();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update currency");
    }
  };

  const canNext = userCurrencies.length > 0;

  return (
    <div
      className="flex flex-col bg-white shadow-md rounded-lg"
      style={{ width: "800px", height: "400px" }}
    >
      {/* Top: Heading + Form */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Currencies</h2>

        <div className="flex mb-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className={`flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select currency
            </option>
            {currencies.map((cur) => (
              <option key={cur.id} value={cur.id}>
                {cur.code} - {cur.name}
              </option>
            ))}
          </select>
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
        {userCurrencies.length === 0 ? (
          <p className="text-gray-500">No currencies added yet.</p>
        ) : (
          <ul className="space-y-2">
            {userCurrencies.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                {editId === item.id ? (
                  <div className="flex flex-1 gap-2">
                    <select
                      value={editCurrency}
                      onChange={(e) => setEditCurrency(e.target.value)}
                      className="flex w-3/4 p-2 border rounded-md"
                    >
                      <option value="" disabled>
                        Select currency
                      </option>
                      {currencies.map((cur) => (
                        <option key={cur.id} value={cur.id}>
                          {cur.code} - {cur.name}
                        </option>
                      ))}
                    </select>
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
                    <span>
                      {item.currency?.code} - {item.currency?.name}
                    </span>
                    <span
                      className={`text-sm ${
                        item.active_flag ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {item.active_flag ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="space-x-2">
                  {editId === item.id ? (
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
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

export default CurrenciesStep;