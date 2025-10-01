import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

import PaymentMethodForm from "./PaymentMethodForm";
import PaymentMethodList from "./PaymentMethodList";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const PaymentMethodPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeMethod, setActiveMethod] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [methodToDelete, setMethodToDelete] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/admin/payment-methods");
      setMethods(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (activeMethod === "new") {
        const res = await api.post("/admin/payment-methods", formData);
        setMethods([...methods, res.data.data]);
      } else {
        const res = await api.put(
          `/admin/payment-methods/${activeMethod.id}`,
          formData
        );
        setMethods(
          methods.map((m) => (m.id === activeMethod.id ? res.data.data : m))
        );
      }
      setIsFormVisible(false);
      setActiveMethod(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save payment method");
    }
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;
    try {
      await api.delete(`/admin/payment-methods/${methodToDelete}`);
      setMethods(methods.filter((m) => m.id !== methodToDelete));
      setMethodToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete payment method");
    }
  };

  const handleAddNewClick = () => {
    setActiveMethod("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (method) => {
    setActiveMethod(method);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setActiveMethod(null);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

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
          <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
          {!isFormVisible && (
            <button
              onClick={handleAddNewClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
            >
              + New Method
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {isFormVisible ? (
          <PaymentMethodForm
            methodToEdit={activeMethod === "new" ? null : activeMethod}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        ) : (
          <PaymentMethodList
            methods={methods}
            onEdit={handleEditClick}
            onDelete={(id) => setMethodToDelete(id)}
          />
        )}
      </main>

      {methodToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this payment method? This action cannot be undone."
          onCancel={() => setMethodToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </>
  );
};

export default PaymentMethodPage;