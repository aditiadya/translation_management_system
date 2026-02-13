import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";

import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import FormTextarea from "../../../../components/Form/TextArea";
import CheckboxField from "../../../../components/Form/CheckboxField";
import BackButton from "../../../../components/Button/BackButton";

const CreateJobsPage = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const [form, setForm] = useState({
    project_id: projectId || "",
    name: "",
    service_id: "",
    language_pair_id: "",
    deadline_at: "",
    vendor_id: "",
    vendor_contact_person_id: "",
    auto_start_on_vendor_acceptance: false,
    checklist_id: "",
    instructions: "",
    pdf_template_id: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectMeta, setProjectMeta] = useState({
    name: "",
    service: "",
    specialization: "",
    language_pairs: "",
    deadline_at: "",
    client: "",
  });

  const [services, setServices] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorContactPersons, setVendorContactPersons] = useState([]);
  const [checklists, setChecklists] = useState([]);

  // Static PDF templates (temporary until backend is ready)
  const pdfTemplates = [
    { id: 1, name: "Standard Template" },
    { id: 2, name: "Professional Template" },
    { id: 3, name: "Detailed Template" },
    { id: 4, name: "Simple Template" },
    { id: 5, name: "Custom Template" },
  ];

  /* ================= Fetch project meta ================= */

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`, {
          withCredentials: true,
        });
        const project = res.data.data;

        setProjectMeta({
          name: project.project_name,
          service: project.service?.name || "—",
          specialization: project.specialization?.name || "—",
          language_pairs: project.languagePairs
            ?.map((lp) => `${lp.sourceLanguage?.name} → ${lp.targetLanguage?.name}`)
            .join(", ") || "—",
          deadline_at: project.deadline_at,
          client: project.client?.company_name || 
                 `${project.client?.primary_user?.first_name || ""} ${project.client?.primary_user?.last_name || ""}`.trim() || "—",
        });

        // Set service_id from project
        setForm((prev) => ({
          ...prev,
          service_id: project.service_id || "",
        }));
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    fetchProject();
  }, [projectId]);

  /* ================= Fetch dropdown data ================= */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/admin-services", {
          withCredentials: true,
        });
        const activeServices = (res.data.data || []).filter(
          (s) => s.active_flag === true
        );
        setServices(activeServices);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchLanguagePairs = async () => {
      try {
        const res = await api.get("/admin-language-pairs", {
          withCredentials: true,
        });
        setLanguagePairs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch language pairs:", err);
      }
    };

    fetchLanguagePairs();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors", { withCredentials: true });
        setVendors(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const res = await api.get("/checklists", {
          withCredentials: true,
        });
        setChecklists(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch checklists:", err);
      }
    };

    fetchChecklists();
  }, []);

  useEffect(() => {
    const fetchVendorContactPersons = async () => {
      if (!form.vendor_id) {
        setVendorContactPersons([]);
        setForm((prev) => ({
          ...prev,
          vendor_contact_person_id: "",
        }));
        return;
      }

      try {
        const res = await api.get(`/vendor/contact-persons/${form.vendor_id}`, {
          withCredentials: true,
        });
        setVendorContactPersons(res.data.data || []);
        setForm((prev) => ({
          ...prev,
          vendor_contact_person_id: "",
        }));
      } catch (err) {
        console.error("Failed to fetch vendor contact persons:", err);
        setVendorContactPersons([]);
      }
    };

    fetchVendorContactPersons();
  }, [form.vendor_id]);

  /* ================= Handlers ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const handleCheckbox = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.checked }));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const getDeadlineStatus = (dateStr) => {
    if (!dateStr) return "";

    const now = new Date();
    const deadline = new Date(dateStr);
    const diffMs = deadline - now;

    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffMs < 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return `${days} day${days !== 1 ? "s" : ""}${
      hours ? `, ${hours} hour${hours !== 1 ? "s" : ""}` : ""
    } left`;
  };

  const validate = () => {
    const err = {};
    if (!form.name?.trim()) err.name = "Job name is required.";
    if (!form.service_id) err.service_id = "Service is required.";
    if (!form.vendor_id) err.vendor_id = "Vendor is required.";
    if (!form.deadline_at) err.deadline_at = "Deadline is required.";
    if (!form.pdf_template_id) err.pdf_template_id = "PDF template is required.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (createAndClone = false) => {
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        ...form,
        vendor_contact_person_id: form.vendor_contact_person_id || null,
        language_pair_id: form.language_pair_id || null,
        instructions: form.instructions || null,
        internal_note: form.internal_note || null,
        checklist_id: form.checklist_id || null,
      };

      const response = await api.post("/jobs", payload, {
        withCredentials: true,
      });

      setSuccess("Job created successfully!");

      if (createAndClone) {
        // Reset form but keep some values for cloning
        setForm((prev) => ({
          ...prev,
          name: "",
          deadline_at: "",
          instructions: "",
        }));
        setSuccess("Job created! You can create another similar job.");
        setIsSubmitting(false);
      } else {
        setTimeout(() => {
          navigate(`/project/${projectId}?tab=jobs`);
        }, 1500);
      }
    } catch (err) {
      console.error("Create job error:", err);
      setServerError(err.response?.data?.message || "Failed to create job.");
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackButton to={`/project/${projectId}?tab=jobs`} />
        <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
      </div>

      {/* ================= Project Details ================= */}
      <section>
        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <DetailRow label="Name" value={projectMeta.name} />
            <DetailRow
              label="Specialization"
              value={projectMeta.specialization}
            />
            <DetailRow
              label="Service"
              value={projectMeta.service}
            />
            <DetailRow
              label="Language Pairs"
              value={projectMeta.language_pairs}
            />
            <DetailRow
              label="Deadline At"
              value={
                <>
                  {formatDateTime(projectMeta.deadline_at)}
                  <span className="text-red-600 ml-2">
                    ({getDeadlineStatus(projectMeta.deadline_at)})
                  </span>
                </>
              }
            />
            <DetailRow label="Client" value={projectMeta.client} />
          </div>
        </div>
      </section>

      <form className="bg-white shadow rounded-lg p-8 space-y-8 mt-6">
        {/* ================= New Job ================= */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Job</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
            <FormInput
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
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
              error={errors.service_id}
              required
              disabled
            />

            <FormSelect
              label="Language Pair"
              name="language_pair_id"
              value={form.language_pair_id}
              onChange={handleChange}
              options={languagePairs.map((lp) => ({
                value: lp.id,
                label: `${lp.sourceLanguage?.name} → ${lp.targetLanguage?.name}`,
              }))}
            />

            <div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FormInput
                    label="Deadline At"
                    name="deadline_at"
                    type="datetime-local"
                    value={form.deadline_at}
                    onChange={handleChange}
                    error={errors.deadline_at}
                    required
                  />
                </div>

                {projectMeta.deadline_at && (
                  <div className="text-sm whitespace-nowrap">
                    <span className="text-gray-900 font-medium">
                      {formatDateTime(projectMeta.deadline_at)}
                    </span>
                    <span className="text-red-600 ml-2">
                      ({getDeadlineStatus(projectMeta.deadline_at)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <FormSelect
              label="Vendor"
              name="vendor_id"
              value={form.vendor_id}
              onChange={handleChange}
              options={vendors.map((vendor) => ({
                value: vendor.id,
                label:
                  vendor.type === "Company"
                    ? vendor.company_name
                    : `${vendor.primary_users?.first_name || ""} ${
                        vendor.primary_users?.last_name || ""
                      }`,
              }))}
              error={errors.vendor_id}
              required
            />

            <FormSelect
              label="Vendor Contact Person"
              name="vendor_contact_person_id"
              value={form.vendor_contact_person_id}
              onChange={handleChange}
              options={vendorContactPersons.map((p) => ({
                value: p.id,
                label: `${p.first_name} ${p.last_name}`,
              }))}
              disabled={!form.vendor_id}
            />

            <div className="md:col-span-2 mb-4">
              <CheckboxField
                label="Auto start on vendor acceptance"
                name="auto_start_on_vendor_acceptance"
                checked={form.auto_start_on_vendor_acceptance}
                onChange={handleCheckbox}
              />
            </div>

            <FormSelect
              label="Checklist"
              name="checklist_id"
              value={form.checklist_id}
              onChange={handleChange}
              options={checklists.map((checklist) => ({
                value: checklist.id,
                label: checklist.name,
              }))}
            />

            <FormSelect
              label="Job Template"
              name="pdf_template_id"
              value={form.pdf_template_id}
              onChange={handleChange}
              options={pdfTemplates.map((template) => ({
                value: template.id,
                label: template.name,
              }))}
              error={errors.pdf_template_id}
              required
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Instructions"
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <FormTextarea
                label="Internal Note"
                name="internal_note"
                value={form.internal_note}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Error and Success Messages */}
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

        {/* Mandatory note */}
        <span className="text-gray-500 text-sm">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory.
        </span>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Create & Clone
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

/* ================= Helper ================= */

const DetailRow = ({ label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="text-gray-500 font-medium w-36">{label}:</span>
    <span className="text-gray-900 font-medium">{value || "—"}</span>
  </div>
);

export default CreateJobsPage;