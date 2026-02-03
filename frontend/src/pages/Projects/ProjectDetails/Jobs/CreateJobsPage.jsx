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
    name: "",
    service_id: "",
    files: [],
    language_pair_id: "",
    deadline_at: "",
    vendor_id: "",
    vendor_contact_id: "",
    auto_start: false,
    checklist_id: "",
    vendor_note: "",
    po_template_id: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [projectMeta, setProjectMeta] = useState({
    name: "",
    specialization: "",
    language_pairs: "",
    deadline_at: "",
    client: "",
  });

  /* ================= Fetch project meta ================= */

  useEffect(() => {
    const fetchProject = async () => {
      const res = await api.get(`/projects/${projectId}`);
      setProjectMeta({
        name: res.data.data.name,
        specialization: res.data.data.specialization_name,
        language_pairs: res.data.data.language_pairs,
        deadline_at: res.data.data.deadline_at,
        client: res.data.data.client_name,
      });
    };

    fetchProject();
  }, [projectId]);

  /* ================= Handlers ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
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
      (absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffMs < 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return `${days} day${days !== 1 ? "s" : ""}${
      hours ? `, ${hours} hour${hours !== 1 ? "s" : ""}` : ""
    } left`;
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
              required
            />

            <FormSelect
              label="Language Pair"
              name="language_pair_id"
              value={form.language_pair_id}
              onChange={handleChange}
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
            />

            <FormSelect
              label="Vendor Contact Person"
              name="vendor_contact_id"
              value={form.vendor_contact_id}
              onChange={handleChange}
            />

            <div className="md:col-span-2 mb-4">
              <CheckboxField
                label="Auto start on vendor acceptance"
                name="auto_start"
                checked={form.auto_start}
                onChange={handleCheckbox}
              />
            </div>

            <FormSelect
              label="Checklist"
              name="checklist_id"
              value={form.checklist_id}
              onChange={handleChange}
            />

            <FormSelect
              label="Job Template"
              name="po_template_id"
              value={form.po_template_id}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Note for Vendor"
                name="vendor_note"
                value={form.vendor_note}
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

        {/* Mandatory note */}
        <span className="text-gray-500 text-sm">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory.
        </span>

        {/* Actions */}
        <div className="flex gap-4 ">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Create
          </button>

          <button
            type="button"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            Create & Clone
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
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
