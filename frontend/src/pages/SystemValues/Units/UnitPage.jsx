import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";

import UnitForm from "./UnitForm";
import UnitList from "./UnitList";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import BackButton from "../../../components/Button/BackButton";

const UnitPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeUnit, setActiveUnit] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [unitToDelete, setUnitToDelete] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await api.get("/admin-units");
      setUnits(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (activeUnit === "new") {
        const res = await api.post("/admin-units", formData);
        setUnits([...units, res.data.data]);
      } else {
        const res = await api.put(
          `/admin-units/${activeUnit.id}`,
          formData
        );
        setUnits(
          units.map((u) => (u.id === activeUnit.id ? res.data.data : u))
        );
      }

      setIsFormVisible(false);
      setActiveUnit(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save unit");
    }
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    try {
      await api.delete(`/admin-units/${unitToDelete}`);
      setUnits(units.filter((u) => u.id !== unitToDelete));
      setUnitToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete unit");
    }
  };

  const handleAddNewClick = () => {
    setActiveUnit("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (unit) => {
    setActiveUnit(unit);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setActiveUnit(null);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <BackButton to="/system-values" />
        <h1 className="text-3xl font-bold text-gray-800">Units</h1>
        </div>

        {!isFormVisible && (
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            Add Unit
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isFormVisible ? (
        <UnitForm
          unitToEdit={activeUnit === "new" ? null : activeUnit}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      ) : (
        <UnitList
          units={units}
          onEdit={handleEditClick}
          onDelete={(id) => setUnitToDelete(id)}
        />
      )}

      {unitToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this unit? This action cannot be undone."
          onCancel={() => setUnitToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </>
  );
};

export default UnitPage;