import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

import UnitForm from "./UnitForm";
import UnitList from "./UnitList";

const UnitPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUnit, setEditingUnit] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSave = async (data) => {
    try {
      if (editingUnit) {
        const res = await api.put(`/admin-units/${editingUnit.id}`, data);
        setUnits(units.map((u) => (u.id === editingUnit.id ? res.data.data : u)));
      } else {
        const res = await api.post("/admin-units", data);
        setUnits([...units, res.data.data]);
      }
      setEditingUnit(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save unit");
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-units/${id}`);
      setUnits(units.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setEditingUnit(null);
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
          <h1 className="text-3xl font-bold text-gray-800">Units</h1>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + New Unit
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium">{error}</div>
        ) : showForm ? (
          <UnitForm
            unitToEdit={editingUnit}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <UnitList units={units} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </>
  );
};

export default UnitPage;