import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import TextEditor from "../../../components/Form/TextEditor";

const CreateProjectForm = () => {
  const navigate = useNavigate();

  const getLocalDateTime = () => {
    const now = new Date();

    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);

    return localTime.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    client_id: "",
    client_contact_person_id: "",
    project_name: "",
    language_pair_ids: [],
    specialization_id: "",
    start_at: getLocalDateTime(),
    deadline_at: "",
    instructions: "",
    internal_note: "",
    primary_manager_id: "",
    secondary_manager_id: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [clients, setClients] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients", { withCredentials: true });
        setClients(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err.response || err);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchLanguagePairs = async () => {
      try {
        const res = await api.get("/admin-language-pairs", {
          withCredentials: true,
        });
        setLanguagePairs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch language pairs:", err.response || err);
      }
    };

    fetchLanguagePairs();
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/admin-specializations", {
          withCredentials: true,
        });

        const activeSpecializations = (res.data.data || []).filter(
          (s) => s.active_flag === true
        );

        setSpecializations(activeSpecializations);
      } catch (err) {
        console.error("Failed to fetch specializations:", err.response || err);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await api.get("/managers", { withCredentials: true });
        setManagers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch managers:", err.response || err);
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchContactPersons = async () => {
      if (!form.client_id) {
        setContactPersons([]);
        setForm((prev) => ({
          ...prev,
          client_contact_person_id: "",
        }));
        return;
      }

      try {
        const res = await api.get(`/client/contact-persons/${form.client_id}`, {
          withCredentials: true,
        });

        setContactPersons(res.data.data || []);

        setForm((prev) => ({
          ...prev,
          client_contact_person_id: "",
        }));
      } catch (err) {
        console.error("Failed to fetch contact persons:", err.response || err);
        setContactPersons([]);
      }
    };

    fetchContactPersons();
  }, [form.client_id]);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) =>
        Number(opt.value)
      );
      setForm((prev) => ({ ...prev, [name]: values }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const err = {};
    if (!form.client_id) err.client_id = "Client is required.";
    if (!form.project_name) err.project_name = "Project name is required.";
    if (!form.start_at) err.start_at = "Start date required.";
    if (!form.deadline_at) err.deadline_at = "Deadline required.";
    if (!form.primary_manager_id)
      err.primary_manager_id = "Primary manager required.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post("/projects", form, { withCredentials: true });
      setSuccess("Project created successfully.");
      navigate("/projects");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to create project."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          label="Client"
          name="client_id"
          value={form.client_id}
          onChange={handleChange}
          options={clients.map((client) => ({
            value: client.id,
            label:
              client.type === "Company"
                ? client.company_name
                : `${client.primary_user?.first_name || ""} ${
                    client.primary_user?.last_name || ""
                  }`,
          }))}
          error={errors.client_id}
          required
        />

        <FormSelect
          label="Client Contact Person"
          name="client_contact_person_id"
          value={form.client_contact_person_id}
          onChange={handleChange}
          options={contactPersons.map((p) => ({
            value: p.id,
            label: `${p.first_name} ${p.last_name}`,
          }))}
          disabled={!form.client_id}
        />

        <FormInput
          label="Project Name"
          name="project_name"
          value={form.project_name}
          onChange={handleChange}
          error={errors.project_name}
          required
        />

        <div>
          <FormSelect
            label="Language Pair"
            name="language_pair_select"
            value=""
            onChange={(e) => {
              const selectedId = Number(e.target.value);

              if (!form.language_pair_ids.includes(selectedId)) {
                setForm((prev) => ({
                  ...prev,
                  language_pair_ids: [...prev.language_pair_ids, selectedId],
                }));
              }
            }}
            options={languagePairs.map((lp) => ({
              value: lp.id,
              label: `${lp.sourceLanguage?.name} → ${lp.targetLanguage?.name}`,
            }))}
          />

          {form.language_pair_ids.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.language_pair_ids.map((id) => {
                const pair = languagePairs.find((lp) => lp.id === id);
                if (!pair) return null;

                return (
                  <span
                    key={id}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {pair.sourceLanguage?.name} → {pair.targetLanguage?.name}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          language_pair_ids: prev.language_pair_ids.filter(
                            (pid) => pid !== id
                          ),
                        }))
                      }
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <FormSelect
          label="Specialization"
          name="specialization_id"
          value={form.specialization_id}
          onChange={handleChange}
          options={specializations.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
        />

        <FormInput
          type="datetime-local"
          label="Start At"
          name="start_at"
          value={form.start_at}
          onChange={handleChange}
          error={errors.start_at}
          required
        />

        <FormInput
          type="datetime-local"
          label="Deadline At"
          name="deadline_at"
          value={form.deadline_at}
          onChange={handleChange}
          error={errors.deadline_at}
          required
        />

        <FormSelect
          label="Primary Manager"
          name="primary_manager_id"
          value={form.primary_manager_id}
          onChange={handleChange}
          options={managers.map((m) => ({
            value: m.id,
            label: `${m.first_name} ${m.last_name}`,
          }))}
          error={errors.primary_manager_id}
          required
        />

        <FormSelect
          label="Secondary Manager"
          name="secondary_manager_id"
          value={form.secondary_manager_id}
          onChange={handleChange}
          options={managers
            .filter((m) => m.id !== Number(form.primary_manager_id))
            .map((m) => ({
              value: m.id,
              label: `${m.first_name} ${m.last_name}`,
            }))}
        />
      </div>

      <TextEditor
        label="Instructions"
        value={form.instructions}
        onChange={(val) =>
          setForm((prev) => ({
            ...prev,
            instructions: val,
          }))
        }
      />

      <div>
        <label className="block text-sm font-semibold mb-1">
          Internal Note
        </label>
        <textarea
          name="internal_note"
          value={form.internal_note}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded-lg p-3 resize-y"
          placeholder="Internal notes (not visible to client)"
        />
      </div>

      {serverError && (
        <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 text-center font-semibold">
          {serverError}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 border border-green-400 rounded p-3 text-center font-semibold">
          {success}
        </div>
      )}

      <span className="text-gray-500 text-sm mt-1">
        Fields marked with <span className="text-red-600">*</span> are
        mandatory.
      </span>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
