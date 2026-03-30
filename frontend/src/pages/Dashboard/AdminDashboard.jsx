import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import {
  FiUsers,
  FiBriefcase,
  FiFolder,
  FiGrid,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPauseCircle,
} from "react-icons/fi";

const colorClasses = {
  blue: { border: "border-t-blue-500", bg: "bg-blue-500" },
  purple: { border: "border-t-purple-500", bg: "bg-purple-500" },
  indigo: { border: "border-t-indigo-500", bg: "bg-indigo-500" },
  teal: { border: "border-t-teal-500", bg: "bg-teal-500" },
  orange: { border: "border-t-orange-500", bg: "bg-orange-500" },
  rose: { border: "border-t-rose-500", bg: "bg-rose-500" },
};

const StatCard = ({ icon: Icon, label, value, color = "blue", to }) => {
  const c = colorClasses[color] || colorClasses.blue;

  const card = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${c.border} p-6 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className={`p-3 rounded-lg ${c.bg}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">
          {value ?? <span className="text-gray-300 animate-pulse">—</span>}
        </p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
};

const JobStatusBadge = ({ status }) => {
  const colours = {
    Draft: "bg-gray-100 text-gray-600",
    "Offered to Vendor": "bg-blue-100 text-blue-700",
    "Offer Accepted": "bg-indigo-100 text-indigo-700",
    "Offer Rejected": "bg-red-100 text-red-700",
    Started: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    "Completion Accepted": "bg-emerald-100 text-emerald-700",
    "Completion Rejected": "bg-rose-100 text-rose-700",
    Hold: "bg-orange-100 text-orange-700",
    Cancelled: "bg-gray-200 text-gray-500",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colours[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const ProjectStatusBadge = ({ status }) => {
  const colours = {
    "In Progress": "bg-blue-100 text-blue-700",
    Draft: "bg-gray-100 text-gray-600",
    Submitted: "bg-indigo-100 text-indigo-700",
    "Submission Accepted": "bg-green-100 text-green-700",
    "Submission Rejected": "bg-red-100 text-red-700",
    "Offered by Client": "bg-purple-100 text-purple-700",
    "Offer Accepted": "bg-teal-100 text-teal-700",
    "Offer Rejected": "bg-rose-100 text-rose-700",
    Hold: "bg-orange-100 text-orange-700",
    Cancelled: "bg-gray-200 text-gray-500",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colours[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    managers: null,
    clients: null,
    vendors: null,
    clientPools: null,
    projects: null,
    jobs: null,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [jobStatusBreakdown, setJobStatusBreakdown] = useState({});
  const [projectStatusBreakdown, setProjectStatusBreakdown] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          managersRes,
          clientsRes,
          vendorsRes,
          clientPoolsRes,
          projectsRes,
          jobsRes,
        ] = await Promise.all([
          api.get("/managers?limit=1"),
          api.get("/clients?limit=1"),
          api.get("/vendors?limit=1"),
          api.get("/client-pools?limit=1"),
          api.get("/projects?limit=5"),
          api.get("/jobs?limit=5"),
        ]);

        setCounts({
          managers: managersRes.data?.meta?.total ?? managersRes.data?.data?.length ?? null,
          clients: clientsRes.data?.meta?.total ?? clientsRes.data?.data?.length ?? null,
          vendors: vendorsRes.data?.meta?.total ?? vendorsRes.data?.data?.length ?? null,
          clientPools: clientPoolsRes.data?.meta?.total ?? clientPoolsRes.data?.data?.length ?? null,
          projects: projectsRes.data?.meta?.total ?? null,
          jobs: jobsRes.data?.meta?.total ?? null,
        });

        const projects = projectsRes.data?.data ?? [];
        setRecentProjects(projects);

        const breakdown = {};
        projects.forEach((p) => {
          breakdown[p.status] = (breakdown[p.status] ?? 0) + 1;
        });
        setProjectStatusBreakdown(breakdown);

        const jobs = jobsRes.data?.data ?? [];
        setRecentJobs(jobs);

        const jobBreakdown = {};
        jobs.forEach((j) => {
          jobBreakdown[j.status] = (jobBreakdown[j.status] ?? 0) + 1;
        });
        setJobStatusBreakdown(jobBreakdown);
      } catch (err) {
        console.error("AdminDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <FiGrid size={22} />
          <span className="text-xs font-semibold tracking-widest uppercase opacity-80">Administrator</span>
        </div>
        <h1 className="text-2xl font-bold">System Dashboard</h1>
        <p className="text-sm opacity-70 mt-1">Full overview of your translation management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FiUsers} label="Managers" value={counts.managers} color="bg-blue-500" to="/managers" />
        <StatCard icon={FiUsers} label="Clients" value={counts.clients} color="bg-purple-500" to="/clients" />
        <StatCard icon={FiUsers} label="Vendors" value={counts.vendors} color="bg-indigo-500" to="/vendors" />
        <StatCard icon={FiGrid} label="Client Pools" value={counts.clientPools} color="bg-teal-500" to="/client-pools" />
        <StatCard icon={FiFolder} label="Projects" value={counts.projects} color="bg-orange-500" to="/projects" />
        <StatCard icon={FiBriefcase} label="Jobs" value={counts.jobs} color="bg-rose-500" to="/jobs" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <p className="text-sm text-gray-400">No projects yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b">
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <Link to={`/project/${p.id}`} className="font-medium text-gray-700 hover:text-blue-600 truncate block max-w-[140px]">
                        {p.project_name}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 truncate max-w-[120px]">
                      {p.client?.company_name ?? "—"}
                    </td>
                    <td className="py-2.5">
                      <ProjectStatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Jobs</h2>
            <Link to="/jobs" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <p className="text-sm text-gray-400">No jobs yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b">
                  <th className="pb-2">Job</th>
                  <th className="pb-2">Vendor</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className="font-medium text-gray-700 truncate block max-w-[140px]">{j.name}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 truncate max-w-[120px]">
                      {j.vendor?.company_name ?? "—"}
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
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Project Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Project Status (recent 5)</h2>
          {loading ? (
            <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ) : Object.keys(projectStatusBreakdown).length === 0 ? (
            <p className="text-sm text-gray-400">No data.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(projectStatusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <ProjectStatusBadge status={status} />
                  <span className="text-sm font-semibold text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Job Status (recent 5)</h2>
          {loading ? (
            <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ) : Object.keys(jobStatusBreakdown).length === 0 ? (
            <p className="text-sm text-gray-400">No data.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(jobStatusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <JobStatusBadge status={status} />
                  <span className="text-sm font-semibold text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/projects/create-project" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
            <FiFolder size={14} /> New Project
          </Link>
          <Link to="/managers/create-manager" className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition">
            <FiUsers size={14} /> Add Manager
          </Link>
          <Link to="/vendors/create-vendor" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
            <FiUsers size={14} /> Add Vendor
          </Link>
          <Link to="/system-values" className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition">
            <FiGrid size={14} /> System Values
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
