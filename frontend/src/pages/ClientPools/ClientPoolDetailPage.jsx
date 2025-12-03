import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import PoolInfoCard from "./PoolInfoCard";
import ClientsCard from "./ClientsCard";
import ManagersCard from "./ManagersCard";
import BackButton from "../../components/Button/BackButton";

const ClientPoolDetailsPage = () => {
  const { id } = useParams();

  const [pool, setPool] = useState(null);
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditingClients, setIsEditingClients] = useState(false);
  const [isEditingManagers, setIsEditingManagers] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const [form, setForm] = useState({
    client_ids: [],
    manager_ids: [],
  });
  const [infoForm, setInfoForm] = useState({
    name: "",
    description: "",
  });

  const fetchPoolDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client-pools/${id}`);
      const poolData = res.data.data;

      setPool(poolData);
      setForm({
        client_ids: poolData.clients?.map((c) => c.id) || [],
        manager_ids: poolData.managers?.map((m) => m.id) || [],
      });
    } catch (err) {
      console.error("Failed to fetch pool details:", err);
      setError("Failed to fetch pool details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [clientsRes, managersRes] = await Promise.all([
        api.get("/clients"),
        api.get("/managers"),
      ]);
      setClients(clientsRes?.data?.data || []);
      setManagers(managersRes?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch clients/managers:", err);
    }
  };

  useEffect(() => {
    fetchPoolDetails();
    fetchAllData();
  }, [id]);

  useEffect(() => {
    if (pool) {
      setInfoForm({
        name: pool.name || "",
        description: pool.description || "",
      });
    }
  }, [pool]);

  const handleMultiSelect = (field, value) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((i) => i !== value)
          : [...prev[field], value],
      };
    });
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!pool) return <div className="text-center mt-10">No pool found</div>;

  return (
    <>
        <div className="flex items-center gap-3 mb-5">
          <BackButton to="/client-pools"/>
          <h1 className="text-2xl font-bold text-gray-900">Client Pool</h1>
        </div>

        <PoolInfoCard
          pool={pool}
          isEditing={isEditingInfo}
          setIsEditing={setIsEditingInfo}
          infoForm={infoForm}
          setInfoForm={setInfoForm}
          setPool={setPool}
        />

        <ClientsCard
          pool={pool}
          allClients={clients}
          isEditing={isEditingClients}
          setIsEditing={setIsEditingClients}
          formState={form}
          handleMultiSelect={handleMultiSelect}
          setPool={setPool}
        />

        <ManagersCard
          pool={pool}
          allManagers={managers}
          isEditing={isEditingManagers}
          setIsEditing={setIsEditingManagers}
          formState={form}
          setFormState={setForm}
          handleMultiSelect={handleMultiSelect}
          setPool={setPool}
        />
    </>
  );
};

export default ClientPoolDetailsPage;