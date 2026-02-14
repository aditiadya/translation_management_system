import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import PriceListTable from "./PriceListTable";
import PriceListForm from "./PriceListForm";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";

const PriceListPage = ({ clientId }) => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchPriceList();
  }, [clientId]);

  const fetchPriceList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/client-price-list", { withCredentials: true });
      
      console.log("Price List Response:", res.data);
      
      const filtered = res.data.data.filter(
        (item) => item.client?.id === parseInt(clientId)
      );
      
      console.log("Filtered Price List:", filtered);
      
      setPriceList(filtered);
      setError("");
    } catch (err) {
      console.error("Error fetching price list:", err);
      setError("Failed to load client price list");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    const editData = {
      id: item.id,
      client_id: item.client_id,
      service_id: item.service?.id || item.service_id,
      language_pair_id: item.languagePair?.id || item.language_pair_id,
      specialization_id: item.specialization?.id || item.specialization_id,
      currency_id: item.currency?.id || item.currency_id,
      unit: item.unit,
      price_per_unit: item.price_per_unit,
      note: item.note || "",
    };
    
    console.log("Editing item:", editData);
    setEditingItem(editData);
    setShowForm(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/client-price-list/${itemToDelete.id}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchPriceList();
    } catch (err) {
      console.error("Error deleting price:", err);
      alert("Failed to delete price list entry");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await api.put(`/client-price-list/${editingItem.id}`, data, {
          withCredentials: true,
        });
      } else {
        await api.post("/client-price-list", data, { withCredentials: true });
      }
      setShowForm(false);
      setEditingItem(null);
      fetchPriceList();
    } catch (err) {
      console.error("Error saving price:", err);
      alert(err.response?.data?.message || "Failed to save client price");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">Loading price list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPriceList}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Client Price List</h2>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Add Price
            </button>
          </div>
          <PriceListTable
            data={priceList}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </>
      ) : (
        <div>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Back to List
          </button>
          <PriceListForm
            clientId={clientId}
            editingItem={editingItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSave={handleSave}
          />
        </div>
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Price Entry"
          message="Are you sure you want to delete this price list entry? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default PriceListPage;
