import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

import SpecializationForm from "./SpecializationForm";
import SpecializationList from "./SpecializationList";

const SpecializationPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSpec, setEditingSpec] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSave = async (data) => {
    try {
      if (editingSpec) {
        const res = await api.put(
          `/admin-specializations/${editingSpec.id}`,
          data
        );
        setSpecializations(
          specializations.map((s) =>
            s.id === editingSpec.id ? res.data.data : s
          )
        );
      } else {
        const res = await api.post("/admin-specializations", data);
        setSpecializations([...specializations, res.data.data]);
      }
      setEditingSpec(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save specialization");
    }
  };

  const handleEdit = (spec) => {
    setEditingSpec(spec);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-specializations/${id}`);
      setSpecializations(specializations.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setEditingSpec(null);
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
          <h1 className="text-3xl font-bold text-gray-800">Specializations</h1>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + New Specialization
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">{error}</div>
        ) : showForm ? (
          <SpecializationForm
            specToEdit={editingSpec}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <SpecializationList
            specializations={specializations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
};

export default SpecializationPage;