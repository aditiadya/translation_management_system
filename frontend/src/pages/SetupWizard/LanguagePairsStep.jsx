import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const LanguagePairsStep = ({ onNext, onBack }) => {
  const [languages, setLanguages] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSource, setEditSource] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await api.get("/languages");
        setLanguages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLanguages();
  }, []);

  const fetchPairs = async () => {
    try {
      const res = await api.get("/admin-language-pairs");
      setPairs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  const handleAdd = async () => {
    if (!source || !target) {
      setError("Both languages must be selected.");
      return;
    }
    if (source === target) {
      setError("Source and target languages cannot be the same.");
      return;
    }

    try {
      await api.post("/admin-language-pairs", {
        source_language_id: source,
        target_language_id: target,
        active_flag: true,
      });
      setSource("");
      setTarget("");
      setError("");
      fetchPairs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add pair");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-language-pairs/${id}`);
      fetchPairs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pair) => {
    setEditId(pair.id);
    setEditSource(pair.sourceLanguage?.id);
    setEditTarget(pair.targetLanguage?.id);
    setEditActive(pair.active_flag);
    setError("");
  };

  const handleUpdate = async (id) => {
    if (!editSource || !editTarget) {
      setError("Both languages must be selected.");
      return;
    }
    if (editSource === editTarget) {
      setError("Source and target languages cannot be the same.");
      return;
    }

    try {
      await api.put(`/admin-language-pairs/${id}`, {
        source_language_id: editSource,
        target_language_id: editTarget,
        active_flag: editActive,
      });
      setEditId(null);
      setEditSource("");
      setEditTarget("");
      setEditActive(true);
      setError("");
      fetchPairs();
    } catch (err) {
      setError("Failed to update pair");
    }
  };

  const canNext = pairs.length > 0;

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Language Pairs
        </h2>

        <div className="flex items-center gap-2 mb-2">
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border p-2 rounded w-[313px]"
          >
            <option value="" disabled>
              Select source
            </option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <span className="text-xl">→</span>

          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="border p-2 rounded w-[313px]"
          >
            <option value="" disabled>
              Select target
            </option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-200"
          >
            Add Pair
          </button>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {pairs.length === 0 ? (
          <p className="text-gray-500">No language pairs added yet.</p>
        ) : (
          <ul className="space-y-2">
            {pairs.map((pair) => (
              <li
                key={pair.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                {editId === pair.id ? (
                  <div className="flex gap-2 w-full items-center">
                    <select
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      className="border p-2 rounded w-1/3"
                    >
                      <option value="" disabled>
                        Select source
                      </option>
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>

                    <span className="text-xl">→</span>

                    <select
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="border p-2 rounded w-1/3"
                    >
                      <option value="" disabled>
                        Select target
                      </option>
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                      Active
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>
                      {pair.sourceLanguage?.name} → {pair.targetLanguage?.name}
                    </span>
                    <span
                      className={`text-sm ${
                        pair.active_flag ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {pair.active_flag ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {editId === pair.id ? (
                    <button
                      onClick={() => handleUpdate(pair.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(pair)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pair.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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
    </div>
  );
};

export default LanguagePairsStep;