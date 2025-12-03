import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

import CurrencyForm from "./CurrencyForm";
import CurrencyList from "./CurrencyList";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import BackButton from "../../../components/Button/BackButton";

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]); 
  const [userCurrencies, setUserCurrencies] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCurrency, setActiveCurrency] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [currencyToDelete, setCurrencyToDelete] = useState(null);

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

  const handleSave = async (formData) => {
    try {
      if (activeCurrency === "new") {
        await api.post("/admin-currencies", formData);
      } else {
        await api.put(`/admin-currencies/${activeCurrency.id}`, formData);
      }

      setIsFormVisible(false);
      setActiveCurrency(null);
      fetchUserCurrencies();
    } catch (err) {
      console.error(err);
      alert("Failed to save currency");
    }
  };

  const handleDelete = async () => {
    if (!currencyToDelete) return;
    try {
      await api.delete(`/admin-currencies/${currencyToDelete}`);
      setCurrencyToDelete(null);
      fetchUserCurrencies();
    } catch (err) {
      console.error(err);
      alert("Failed to delete currency");
    }
  };

  const handleAddNewClick = () => {
    setActiveCurrency("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (currency) => {
    setActiveCurrency(currency);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setActiveCurrency(null);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <BackButton to="/system-values" />
        <h1 className="text-3xl font-bold text-gray-800">Currencies</h1>
        </div>

        {!isFormVisible && (
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            Add Currency
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isFormVisible ? (
        <CurrencyForm
          currencyToEdit={activeCurrency === "new" ? null : activeCurrency}
          currencies={currencies}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      ) : (
        <CurrencyList
          userCurrencies={userCurrencies}
          onEdit={handleEditClick}
          onDelete={(id) => setCurrencyToDelete(id)}
        />
      )}

      {currencyToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this currency? This action cannot be undone."
          onCancel={() => setCurrencyToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </>
  );
};

export default CurrencyPage;
