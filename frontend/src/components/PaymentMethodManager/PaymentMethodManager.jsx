import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import PaymentMethodForm from "../../pages/SystemValues/PaymentMethods/PaymentMethodForm";
import PaymentMethodList from "../../pages/SystemValues/PaymentMethods/PaymentMethodList";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import BackButton from "../../components/Button/BackButton";

/**
 * Reusable PaymentMethodManager component
 * Can be used in both SystemValues and SetupWizard contexts
 *
 * @param {Object} props
 * @param {boolean} props.wizardMode - If true, displays wizard controls, hides BackButton
 * @param {function} props.onNext - Wizard mode: called when Next is clicked
 * @param {function} props.onBack - Wizard mode: called when Back is clicked
 * @param {string} props.backLink - Non-wizard mode: link for BackButton
 */
const PaymentMethodManager = ({
  wizardMode = false,
  onNext = null,
  onBack = null,
  backLink = "/system-values",
}) => {
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

  const canNext = methods.length > 0;

  return (
    <div
      className={wizardMode ? "flex flex-col h-full bg-white shadow-md rounded-lg" : ""}
    >
      {/* Header Section */}
      {!wizardMode && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BackButton to={backLink} />
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
      )}

      {/* Wizard Mode Header */}
      {wizardMode && (
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Add Payment Methods
          </h2>

          {!isFormVisible && (
            <button
              onClick={() => {
                setActiveMethod("new");
                setIsFormVisible(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow w-full"
            >
              Add Payment Method
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 p-4">{error}</p>}

      {/* Form or List Section */}
      {isFormVisible ? (
        <div className={wizardMode ? "flex-1 overflow-y-auto p-4" : ""}>
          <PaymentMethodForm
            methodToEdit={activeMethod !== "new" ? activeMethod : null}
            onSave={handleSave}
            onCancel={() => {
              setIsFormVisible(false);
              setActiveMethod(null);
            }}
          />
        </div>
      ) : (
        <div className={wizardMode ? "flex-1 overflow-y-auto p-4" : ""}>
          <PaymentMethodList
            methods={methods}
            onEdit={(method) => {
              setActiveMethod(method);
              setIsFormVisible(true);
            }}
            onDelete={(id) => setMethodToDelete(id)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
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

      {/* Wizard Mode Footer */}
      {wizardMode && (
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
      )}
    </div>
  );
};

export default PaymentMethodManager;
