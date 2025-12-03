import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import PaymentMethodForm from "./PaymentMethodForm";
import PaymentMethodList from "./PaymentMethodList";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import BackButton from "../../../components/Button/BackButton";

const PaymentMethodPage = () => {
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
      const res = await api.get("/admin-payment-methods");
      setMethods(res.data.data || []);
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
        await api.post("/admin-payment-methods", formData);
      } else {
        await api.put(`/admin-payment-methods/${activeMethod.id}`, formData);
      }

      const res = await api.get("/admin-payment-methods");
      setMethods(res.data.data);

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
      await api.delete(`/admin-payment-methods/${methodToDelete}`);
      setMethods(methods.filter((m) => m.id !== methodToDelete));
      setMethodToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete payment method");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BackButton to="/system-values" />
            <h1 className="text-3xl font-bold text-gray-800">
              Payment Methods
            </h1>
          </div>

          {!isFormVisible && (
            <button
              onClick={() => {
                setActiveMethod("new");
                setIsFormVisible(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
            >
              Add Payment Method
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {isFormVisible ? (
          <PaymentMethodForm
            methodToEdit={activeMethod !== "new" ? activeMethod : null}
            onSave={handleSave}
            onCancel={() => {
              setIsFormVisible(false);
              setActiveMethod(null);
            }}
          />
        ) : (
          <PaymentMethodList
            methods={methods}
            onEdit={(method) => {
              setActiveMethod(method);
              setIsFormVisible(true);
            }}
            onDelete={(id) => setMethodToDelete(id)}
          />
        )}

      {methodToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this payment method?"
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