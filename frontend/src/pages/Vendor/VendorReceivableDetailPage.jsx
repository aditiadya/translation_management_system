import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/axiosInstance";

const fmtNum = (v) =>
  v !== undefined && v !== null && v !== "" ? Number(v).toFixed(2) : "—";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Row = ({ label, value, children }) => (
  <div className="flex border-b last:border-b-0 text-sm">
    <div className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-700">{label}</div>
    <div className="w-2/3 px-4 py-3 text-gray-900">{children || value || "—"}</div>
  </div>
);

const VendorReceivableDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "flat_rate";
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/vendor-receivables/${id}?type=${type}`, {
          withCredentials: true,
        });
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load receivable details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id, type]);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-medium">{error}</div>;
  if (!data) return <div className="text-center mt-10 text-gray-500">Receivable not found.</div>;

  const langPair = data.job?.languagePair
    ? `${data.job.languagePair.sourceLanguage?.name || ""} - ${data.job.languagePair.targetLanguage?.name || ""}`
    : "—";

  const currCode = data.currency?.currency?.code || "—";
  const typeName = data.type === "flat_rate" ? "Flat rate" : "Unit based";

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate("/vendor/receivables")}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        ← Back to Receivables
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-sm font-bold text-teal-700 px-5 pt-5 pb-3 uppercase">
          Receivable Details
        </h3>
        <div className="border rounded-md mx-5 mb-5 overflow-hidden">
          <Row label="Code" value={`WL${data.id}`} />
          <Row label="Invoice" value="—" />
          <Row label="Type" value={typeName} />
          <Row label="Job">
            <Link
              to={`/vendor/job/${data.job_id}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              LT{data.job_id}
            </Link>
          </Row>
          <Row label="Job service" value={data.job?.service?.name} />
          <Row label="Job language pair" value={langPair} />
          {data.type === "unit_based" && (
            <>
              <Row label="Unit amount" value={fmtNum(data.unit_amount)} />
              <Row label="Unit" value={data.unit?.name} />
              <Row label="Price per unit" value={fmtNum(data.price_per_unit)} />
            </>
          )}
          <Row label="Total" value={fmtNum(data.subtotal)} />
          <Row label="Currency" value={currCode} />
          <Row label="Issued at" value={fmtDate(data.createdAt)} />
          {data.note_for_vendor && (
            <Row label="Note for vendor" value={data.note_for_vendor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorReceivableDetailPage;
