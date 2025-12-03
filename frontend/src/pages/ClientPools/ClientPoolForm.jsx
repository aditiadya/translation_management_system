import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import FormInput from "../../components/Form/FormInput";
import FormTextarea from "../../components/Form/TextArea";
import BackButton from "../../components/Button/BackButton";

const AddClientPoolPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    client_ids: [],
    manager_ids: [],
  });
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, managersRes] = await Promise.all([
          api.get("/clients"),
          api.get("/managers"),
        ]);
        setClients(clientsRes.data.data || []);
        setManagers(managersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching clients/managers:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, id) => {
    setForm((prev) => {
      const selected = new Set(prev[name]);
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      return { ...prev, [name]: [...selected] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/client-pools", form);
      navigate("/client-pools");
    } catch (error) {
      console.error("Error creating client pool:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="flex items-center gap-3 mb-5">
          <BackButton to="/client-pools"/>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Client Pool
          </h1>
        </div>
        <form 
          onSubmit={handleSubmit} 
          noValidate 
          className="bg-white shadow rounded-lg p-8"
        >
          <div className="w-1/2 mb-1">
            <FormInput
              label="Client Pool Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <FormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="mb-8">
            <label className="block text-md font-bold text-gray-700 mb-2">
              Select Clients
            </label>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
                  <tr>
                    <th className="p-2 w-10"></th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => {
                    const isChecked = form.client_ids.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => handleMultiSelect("client_ids", c.id)}
                        className={`cursor-pointer border-b last:border-0 ${
                          isChecked
                            ? "bg-indigo-50 hover:bg-indigo-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleMultiSelect("client_ids", c.id)
                            }
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="p-2 font-medium text-gray-800">
                          {c.company_name
                            ? c.company_name
                            : `${c.primary_user?.first_name || ""} ${
                                c.primary_user?.last_name || ""
                              }`.trim()}
                        </td>
                        <td className="p-2 text-gray-600">{c.type || "—"}</td>
                        <td className="p-2 text-gray-600">{c.status || "—"}</td>
                        <td className="p-2 text-gray-600">
                          {c.country || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block text-md font-bold text-gray-700 mb-2">
              Select Managers
            </label>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
              <ul className="divide-y">
                {managers.map((m) => {
                  const isChecked = form.manager_ids.includes(m.id);
                  return (
                    <li
                      key={m.id}
                      onClick={() => handleMultiSelect("manager_ids", m.id)}
                      className={`flex items-center gap-2 p-2 cursor-pointer ${
                        isChecked
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiSelect("manager_ids", m.id)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-gray-700">
                        {`${m.first_name} ${m.last_name}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </table>
            </div>
          </div>


          <p className="text-sm text-gray-600 mt-8 mb-4">
            Fields marked with <span className="text-red-500 font-semibold">*</span> are mandatory.
          </p>
          <div className="flex justify-start gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/client-pools")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
    </>
  );
};

export default AddClientPoolPage;