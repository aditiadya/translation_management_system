import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import TextEditor from "../../../../components/Form/TextEditor";
import BackButton from "../../../../components/Button/BackButton";

const EditProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [services, setServices] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [showPairs, setShowPairs] = useState(false);

  const toLocalDateTimeInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  // Fetch existing project and all dropdown data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          projectRes,
          clientsRes,
          servicesRes,
          languagePairsRes,
          specializationsRes,
          managersRes,
        ] = await Promise.all([
          api.get(`/projects/${id}`, { withCredentials: true }),
          api.get("/clients", { withCredentials: true }),
          api.get("/admin-services", { withCredentials: true }),
          api.get("/admin-language-pairs", { withCredentials: true }),
          api.get("/admin-specializations", { withCredentials: true }),
          api.get("/managers", { withCredentials: true }),
        ]);

        const project = projectRes.data.data;

        setClients(clientsRes.data.data || []);
        setServices(
          (servicesRes.data.data || []).filter((s) => s.active_flag === true)
        );
        setLanguagePairs(languagePairsRes.data.data || []);
        setSpecializations(
          (specializationsRes.data.data || []).filter(
            (s) => s.active_flag === true
          )
        );
        setManagers(managersRes.data.data || []);

        // Pre-populate form from project data
        setForm({
          client_id: project.client?.id ? String(project.client.id) : "",
          client_contact_person_id: project.contactPerson?.id
            ? String(project.contactPerson.id)
            : "",
          project_name: project.project_name || "",
          service_id: project.service?.id ? String(project.service.id) : "",
          language_pair_ids: (project.languagePairs || []).map((lp) => lp.id),
          specialization_id: project.specialization?.id
            ? String(project.specialization.id)
            : "",
          start_at: toLocalDateTimeInput(project.start_at),
          deadline_at: toLocalDateTimeInput(project.deadline_at),
          instructions: project.instructions || "",
          internal_note: project.internal_note || "",
          primary_manager_id: project.primaryManager?.id
            ? String(project.primaryManager.id)
            : "",
          secondary_manager_id: project.secondaryManager?.id
            ? String(project.secondaryManager.id)
            : "",
        });
      } catch (err) {
        console.error("Failed to load project data:", err);
        setServerError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Re-fetch contact persons when client changes
  useEffect(() => {
    if (!form?.client_id) {
      setContactPersons([]);
      return;
    }

    const fetchContactPersons = async () => {
      try {
        const res = await api.get(
          `/client/contact-persons/${form.client_id}`,
          { withCredentials: true }
        );
        setContactPersons(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch contact persons:", err);
        setContactPersons([]);
      }
    };

    fetchContactPersons();
  }, [form?.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When client changes, reset contact person
    if (name === "client_id") {
      setForm((prev) => ({
        ...prev,
        client_id: value,
        client_contact_person_id: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const err = {};
    if (!form.client_id) err.client_id = "Client is required.";
    if (!form.project_name?.trim())
      err.project_name = "Project name is required.";
    if (!form.start_at) err.start_at = "Start date is required.";
    if (!form.deadline_at) err.deadline_at = "Deadline is required.";
    if (!form.primary_manager_id)
      err.primary_manager_id = "Primary manager is required.";
    if (!form.language_pair_ids || form.language_pair_ids.length === 0)
      err.language_pair_ids = "At least one language pair is required.";
    if (
      form.start_at &&
      form.deadline_at &&
      form.deadline_at <= form.start_at
    ) {
      err.deadline_at = "Deadline must be after start date.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        ...form,
        client_contact_person_id: form.client_contact_person_id || null,
        service_id: form.service_id || null,
        specialization_id: form.specialization_id || null,
        secondary_manager_id: form.secondary_manager_id || null,
        instructions: form.instructions || null,
        internal_note: form.internal_note || null,
      };

      await api.put(`/projects/${id}`, payload, { withCredentials: true });

      setSuccess("Project updated successfully!");
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Update project error:", err);
      setServerError(
        err.response?.data?.message || "Failed to update project."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading project...</div>
    );
  }

  if (!form) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        {serverError || "Project not found."}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-8 space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <BackButton to={`/project/${id}`} />
        <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
      </div>

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
                  }`.trim(),
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

        <FormSelect
          label="Service"
          name="service_id"
          value={form.service_id}
          onChange={handleChange}
          options={services.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
        />

        {/* Language Pairs */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Language Pairs <span className="text-red-600">*</span>
          </label>

          <FormSelect
            label=""
            name="language_pair_select"
            value=""
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              if (
                selectedId &&
                !form.language_pair_ids.includes(selectedId)
              ) {
                setForm((prev) => ({
                  ...prev,
                  language_pair_ids: [...prev.language_pair_ids, selectedId],
                }));
                setErrors((prev) => ({ ...prev, language_pair_ids: "" }));
              }
            }}
            options={languagePairs
              .filter((lp) => !form.language_pair_ids.includes(lp.id))
              .map((lp) => ({
                value: lp.id,
                label: `${lp.sourceLanguage?.name} → ${lp.targetLanguage?.name}`,
              }))}
            placeholder="Select a language pair to add"
          />

          {errors.language_pair_ids && (
            <p className="text-red-500 text-sm mt-1">
              {errors.language_pair_ids}
            </p>
          )}

          {form.language_pair_ids.length > 0 && (
  <div className="mt-3 border rounded-lg bg-gray-50">
    <button
      type="button"
      onClick={() => setShowPairs((prev) => !prev)}
      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      <span>{form.language_pair_ids.length} language pair{form.language_pair_ids.length > 1 ? "s" : ""} selected</span>
      <span className="text-gray-400">{showPairs ? "▲" : "▼"}</span>
    </button>

    {showPairs && (
      <div className="flex flex-wrap gap-2 px-3 pb-3">
        {form.language_pair_ids.map((id) => {
          const pair = languagePairs.find((lp) => lp.id === id);
          if (!pair) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
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
                className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                aria-label="Remove language pair"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    )}
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
          setForm((prev) => ({ ...prev, instructions: val }))
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
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${id}`)}
          disabled={isSubmitting}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProjectDetails;