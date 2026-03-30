import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiPauseCircle,
} from "react-icons/fi";

const statusMeta = {
  Draft:                 { color: "bg-gray-100 text-gray-600",      icon: FiClock },
  "Offered to Vendor":   { color: "bg-blue-100 text-blue-700",      icon: FiBriefcase },
  "Offer Accepted":      { color: "bg-indigo-100 text-indigo-700",  icon: FiThumbsUp },
  "Offer Rejected":      { color: "bg-red-100 text-red-700",        icon: FiThumbsDown },
  Started:               { color: "bg-yellow-100 text-yellow-700",  icon: FiClock },
  Completed:             { color: "bg-green-100 text-green-700",    icon: FiCheckCircle },
  "Completion Accepted": { color: "bg-emerald-100 text-emerald-700", icon: FiCheckCircle },
  "Completion Rejected": { color: "bg-rose-100 text-rose-700",      icon: FiAlertCircle },
  Hold:                  { color: "bg-orange-100 text-orange-700",  icon: FiPauseCircle },
  Cancelled:             { color: "bg-gray-200 text-gray-500",      icon: FiAlertCircle },
};

const JobStatusBadge = ({ status }) => {
  const meta = statusMeta[status] ?? { color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
      {status}
    </span>
  );
};

const SummaryCard = ({ icon: Icon, label, count, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 p-5 flex items-center gap-4`}>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {count ?? <span className="text-gray-300 animate-pulse">—</span>}
      </p>
    </div>
  </div>
);

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs?limit=50")
      .then((res) => setJobs(res.data?.data ?? []))
      .catch((err) => console.error("VendorDashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Counts by status
  const pending   = jobs.filter((j) => j.status === "Offered to Vendor").length;
  const active    = jobs.filter((j) => ["Offer Accepted", "Started"].includes(j.status)).length;
  const completed = jobs.filter((j) => ["Completed", "Completion Accepted"].includes(j.status)).length;
  const rejected  = jobs.filter((j) => ["Offer Rejected", "Completion Rejected", "Cancelled"].includes(j.status)).length;

  // Action-required jobs: offered but not yet accepted/rejected
  const actionRequired = jobs.filter((j) => j.status === "Offered to Vendor");

  // In-progress jobs
  const inProgress = jobs.filter((j) => ["Offer Accepted", "Started"].includes(j.status));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <FiBriefcase size={22} />
          <span className="text-xs font-semibold tracking-widest uppercase opacity-80">Vendor Portal</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.username}</h1>
        <p className="text-sm opacity-70 mt-1">Here's what's happening with your jobs today</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={FiBriefcase}    label="Pending Offers"  count={loading ? null : pending}   color="bg-blue-500" />
        <SummaryCard icon={FiClock}        label="Active Jobs"     count={loading ? null : active}    color="bg-yellow-500" />
        <SummaryCard icon={FiCheckCircle}  label="Completed"       count={loading ? null : completed} color="bg-green-500" />
        <SummaryCard icon={FiAlertCircle}  label="Rejected / Cancelled" count={loading ? null : rejected}  color="bg-red-400" />
      </div>

      {/* Action Required */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Action Required</h2>
            <p className="text-xs text-gray-400">Jobs offered to you that need a response</p>
          </div>
          {actionRequired.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {actionRequired.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : actionRequired.length === 0 ? (
          <p className="text-sm text-gray-400">No pending offers right now.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b">
                <th className="pb-2">Job Name</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Deadline</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {actionRequired.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-gray-700 max-w-[160px] truncate">{j.name}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{j.service?.name ?? "—"}</td>
                  <td className="py-2.5 pr-4 text-gray-500">
                    {j.deadline_at ? new Date(j.deadline_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5">
                    <JobStatusBadge status={j.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* In Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">In Progress</h2>
            <p className="text-xs text-gray-400">Jobs you're currently working on</p>
          </div>
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline">View all jobs</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : inProgress.length === 0 ? (
          <p className="text-sm text-gray-400">No jobs in progress.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b">
                <th className="pb-2">Job Name</th>
                <th className="pb-2">Language Pair</th>
                <th className="pb-2">Deadline</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inProgress.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-gray-700 max-w-[160px] truncate">{j.name}</td>
                  <td className="py-2.5 pr-4 text-gray-500">
                    {j.languagePair
                      ? `${j.languagePair.sourceLanguage?.name ?? "?"} → ${j.languagePair.targetLanguage?.name ?? "?"}`
                      : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500">
                    {j.deadline_at ? new Date(j.deadline_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5">
                    <JobStatusBadge status={j.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Jobs Status Breakdown */}
      {!loading && jobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">All Jobs by Status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(
              jobs.reduce((acc, j) => {
                acc[j.status] = (acc[j.status] ?? 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <JobStatusBadge status={status} />
                <span className="text-sm font-semibold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
