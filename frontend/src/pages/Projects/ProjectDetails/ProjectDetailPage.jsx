import { useSearchParams, useParams } from "react-router-dom";
import DetailsPage from "./Details/DetailsPage";
import FilesPage from "./Files/FilesPage";
import FinancePage from "./Finances/FinancePage";
import JobsPage from "./Jobs/JobsPage";

const tabs = ["Details", "Files", "Jobs", "Workflow", "Finances", "CAT Logs"];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "details";

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <>
      <div className="border-b mb-6 flex space-x-5">
        {tabs.map((tab) => {
          const key = tab.toLowerCase().replace(" ", "");

          return (
            <button
              key={tab}
              className={`pb-2 text-sm border-b-2 transition ${
                activeTab === key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={() => setTab(key)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "details" && <DetailsPage projectId={id} />}
      {activeTab === "files" && <FilesPage projectId={id} />}
      {activeTab === "finances" && <FinancePage projectId={id} />}
      {activeTab === "jobs" && <JobsPage projectId={id} />}
      {/*
      {activeTab === "Workflow" && <WorkflowPage projectId={id} />}
      {activeTab === "CAT Logs" && <CatLogsPage projectId={id} />} */}
    </>
  );
};

export default ProjectDetailPage;
