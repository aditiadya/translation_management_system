import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import SpecializationForm from "./SpecializationForm";
import SpecializationList from "./SpecializationList";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import BackButton from "../../../components/Button/BackButton";

const SpecializationPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSpec, setActiveSpec] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [specToDelete, setSpecToDelete] = useState(null);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const res = await api.get("/admin-specializations");
      setSpecializations(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch specializations");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (activeSpec === "new") {
        const res = await api.post("/admin-specializations", formData);
        setSpecializations([...specializations, res.data.data]);
      } else {
        const res = await api.put(
          `/admin-specializations/${activeSpec.id}`,
          formData
        );
        setSpecializations(
          specializations.map((s) =>
            s.id === activeSpec.id ? res.data.data : s
          )
        );
      }

      setIsFormVisible(false);
      setActiveSpec(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save specialization");
    }
  };

  const handleDelete = async () => {
    if (!specToDelete) return;
    try {
      await api.delete(`/admin-specializations/${specToDelete}`);
      setSpecializations(specializations.filter((s) => s.id !== specToDelete));
      setSpecToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete specialization");
    }
  };

  const handleAddNewClick = () => {
    setActiveSpec("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (spec) => {
    setActiveSpec(spec);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setActiveSpec(null);
    setIsFormVisible(false);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center gap-3 mb-8">
        <div className="flex items-center gap-3">
            <BackButton to="/system-values" />
        <h1 className="text-2xl font-bold text-gray-900">Specializations</h1>
        </div>

        {!isFormVisible && (
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            Add Specialization
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isFormVisible ? (
        <SpecializationForm
          specToEdit={activeSpec === "new" ? null : activeSpec}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      ) : (
        <SpecializationList
          specializations={specializations}
          onEdit={handleEditClick}
          onDelete={(id) => setSpecToDelete(id)}
        />
      )}

      {specToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this specialization? This action cannot be undone."
          onCancel={() => setSpecToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </>
  );
};

export default SpecializationPage;