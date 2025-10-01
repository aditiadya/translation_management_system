import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

import CurrencyForm from "./CurrencyForm";
import CurrencyList from "./CurrencyList";

const CurrencyPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [userCurrencies, setUserCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCurrencies();
    fetchUserCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const res = await api.get("/currencies");
      setCurrencies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserCurrencies = async () => {
    try {
      const res = await api.get("/admin-currencies");
      setUserCurrencies(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch currencies");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingCurrency) {
        await api.put(`/admin-currencies/${editingCurrency.id}`, data);
      } else {
        await api.post("/admin-currencies", data);
      }
      setEditingCurrency(null);
      setShowForm(false);
      fetchUserCurrencies();
    } catch (err) {
      console.error(err);
      alert("Failed to save currency");
    }
  };

  const handleEdit = (currency) => {
    setEditingCurrency(currency);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-currencies/${id}`);
      fetchUserCurrencies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setEditingCurrency(null);
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Currencies</h1>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + New Currency
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">{error}</div>
        ) : showForm ? (
          <CurrencyForm
            currencyToEdit={editingCurrency}
            currencies={currencies}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <CurrencyList
            userCurrencies={userCurrencies}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
};

export default CurrencyPage;