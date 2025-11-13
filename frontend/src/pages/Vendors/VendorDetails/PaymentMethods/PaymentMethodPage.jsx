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
    } catch (err) {
      console.error(err);
      alert("Failed to save vendor payment method");
    }
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;
    try {
      await api.delete(`/vendor-payment-methods/${methodToDelete}`);
      setMethods(methods.filter((m) => m.id !== methodToDelete));
      setMethodToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete vendor payment method");
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
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + Add Method
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
          message="Are you sure you want to delete this vendor payment method?"
          onCancel={() => setMethodToDelete(null)}
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