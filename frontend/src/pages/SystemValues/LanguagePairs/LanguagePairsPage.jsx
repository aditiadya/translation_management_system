import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import LanguagePairList from "./LanguagePairList";
import LanguagePairForm from "./LanguagePairForm";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const LanguagePairsPage = () => {
  const [pairs, setPairs] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePair, setActivePair] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pairToDelete, setPairToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pairsRes, languagesRes] = await Promise.all([
          api.get("/admin-language-pairs"),
          api.get("/languages"),
        ]);
        setPairs(pairsRes.data.data);
        setLanguages(languagesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load required data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (activePair === "new") {
        const res = await api.post("/admin-language-pairs", formData);
        setPairs([...pairs, res.data.data]);
      } else {
        const res = await api.put(
          `/admin-language-pairs/${activePair.id}`,
          formData
        );
        setPairs(
          pairs.map((p) => (p.id === activePair.id ? res.data.data : p))
        );
      }
      setIsFormVisible(false);
      setActivePair(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save language pair");
    }
  };

  const handleDelete = async () => {
    if (!pairToDelete) return;
    try {
      await api.delete(`/admin-language-pairs/${pairToDelete}`);
      setPairs(pairs.filter((p) => p.id !== pairToDelete));
      setPairToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete language pair");
    }
  };

  const handleAddNewClick = () => {
    setActivePair("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (pair) => {
    setActivePair(pair);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setActivePair(null);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Language Pairs</h1>
          {!isFormVisible && (
            <button
              onClick={handleAddNewClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
            >
              + New Language Pair
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {isFormVisible ? (
          <LanguagePairForm
            itemToEdit={activePair === "new" ? null : activePair}
            onSave={handleSave}
            onCancel={handleCancelForm}
            languages={languages}
          />
        ) : (
          <LanguagePairList
            pairs={pairs}
            onEdit={handleEditClick}
            onDelete={(id) => setPairToDelete(id)}
          />
        )}

      {pairToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this language pair? This action cannot be undone."
          onCancel={() => setPairToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
        />
      )}
    </>
  );
};

export default LanguagePairsPage;