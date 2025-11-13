import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import PriceListTable from "./PriceListTable";
import PriceListForm from "./PriceListForm";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";

const PriceListPage = ({ vendorId }) => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchPriceList();
  }, [vendorId]);

  const fetchPriceList = async () => {
    try {
      const res = await api.get("/vendor-price-list", { withCredentials: true });
      const filtered = res.data.data.filter(
        (item) => item.vendor?.id === parseInt(vendorId)
      );
      setPriceList(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendor price list");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/vendor-price-list/${itemToDelete.id}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      fetchPriceList();
    } catch (err) {
      console.error(err);
      alert("Failed to delete price list entry");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await api.put(`/vendor-price-list/${editingItem.id}`, data, {
          withCredentials: true,
        });
      } else {
        await api.post("/vendor-price-list", data, { withCredentials: true });
      }
      setShowForm(false);
      fetchPriceList();
    } catch (err) {
      console.error(err);
      alert("Failed to save vendor price");
    }
  };

  if (loading) return <div className="text-center mt-6 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-6 text-red-600">{error}</div>;

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Vendor Price List</h2>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Price
            </button>
          </div>
          <PriceListTable
            data={priceList}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </>
      ) : (
        <PriceListForm
          vendorId={vendorId}
          editingItem={editingItem}
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Price Entry"
          message="Are you sure you want to delete this price list entry?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PriceListPage;
