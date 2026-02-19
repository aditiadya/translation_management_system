import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import PaymentMethodForm from "./PaymentMethodForm";
import PaymentMethodList from "./PaymentMethodList";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";

const PaymentMethodsPage = ({ vendorId }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeMethod, setActiveMethod] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (vendorId) fetchMethods();
  }, [vendorId]);

  const fetchMethods = async () => {
    try {
      const res = await api.get(`/vendor-payment-methods/${vendorId}`);
      setMethods(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendor payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        vendor_id: vendorId,
      };

      if (activeMethod === "new") {
        const res = await api.post(`/vendor-payment-methods`, payload);
        setMethods([...methods, res.data.data]);
      } else {
        await api.put(`/vendor-payment-methods/${activeMethod.id}`, payload);
        await fetchMethods();
      }

      setIsFormVisible(false);
      setActiveMethod(null);
      setDeleteError(""); // CLEAR ERROR ON SUCCESSFUL SAVE
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteClick = (id) => {
    const methodToRemove = methods.find((m) => m.id === id);
    
    if (methodToRemove?.is_default && methods.length > 1) {
      setDeleteError("Cannot delete default payment method. Please set another payment method as default first.");
      return;
    }
    
    setMethodToDelete(id);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;
    try {
      await api.delete(`/vendor-payment-methods/${methodToDelete}`);
      setMethods(methods.filter((m) => m.id !== methodToDelete));
      setMethodToDelete(null);
      setDeleteError("");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to delete vendor payment method";
      setDeleteError(errorMsg);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Vendor Payment Methods
        </h1>

        {!isFormVisible && (
          <button
            onClick={() => {
              setActiveMethod("new");
              setIsFormVisible(true);
              setDeleteError(""); // CLEAR ERROR WHEN ADDING NEW
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + Add Method
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {deleteError && !isFormVisible && ( // ONLY SHOW WHEN NOT IN FORM VIEW
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start justify-between">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError("")}
            className="text-red-900 hover:text-red-700 ml-4"
          >
            ×
          </button>
        </div>
      )}

      {isFormVisible ? (
        <PaymentMethodForm
          methodToEdit={activeMethod !== "new" ? activeMethod : null}
          onSave={handleSave}
          onCancel={() => {
            setIsFormVisible(false);
            setActiveMethod(null);
            setDeleteError(""); // CLEAR ERROR ON CANCEL
          }}
        />
      ) : (
        <PaymentMethodList
          methods={methods}
          onEdit={(method) => {
            setActiveMethod(method);
            setIsFormVisible(true);
            setDeleteError(""); // CLEAR ERROR WHEN EDITING
          }}
          onDelete={handleDeleteClick}
        />
      )}

      {methodToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this vendor payment method?"
          onCancel={() => {
            setMethodToDelete(null);
            setDeleteError("");
          }}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default PaymentMethodsPage;
