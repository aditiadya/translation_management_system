import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import Button from "../../components/Button/Button";
import FormInput from "../../components/Form/FormInput";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-6 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex items-center gap-4 mb-8">
        <BackButton to="/client-pools"  className={"mt-1"}/>
          <h1 className="text-3xl font-bold text-gray-800">
            Create Client Pool
          </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Client Pool Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <FormTextarea
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-md font-bold text-gray-700 mb-2">
                Select Clients
              </label>
              <div className="border rounded-lg max-h-50 overflow-y-auto">
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
                              : `${c.primary_users?.first_name || ""} ${
                                  c.primary_users?.last_name || ""
                                }`.trim()}
                          </td>
                          <td className="p-2 text-gray-600">{c.type || "—"}</td>
                          <td className="p-2 text-gray-600">
                            {c.status || "—"}
                          </td>
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
                          onChange={() =>
                            handleMultiSelect("manager_ids", m.id)
                          }
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
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Client Pool"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default AddClientPoolPage;