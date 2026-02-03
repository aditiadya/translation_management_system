import { useParams } from "react-router-dom";
import BackButton from "../../../../../components/Button/BackButton";

import JobStatusStepper from "./JobStatusStepper";
import JobDetailsInfoCard from "./JobDetailsInfoCard";
import AssignmentStatusCard from "./AssignmentStatusCard";
import ChecklistAnswersCard from "./ChecklistAnswersCard";
import VendorRatingCard from "./VendorRatingCard";
import PayablesToVendorCard from "./PayablesToVendorCard";
import LinkedInputFilesCard from "./LinkedInputFilesCard";
import OutputFilesCard from "./OutputFilesCard";
import MessagesCard from "./MessagesCard";

const JobDetailPage = () => {
  const { id: projectId, jobId } = useParams();

  return (
    <div className="space-y-8">
      {/* Page Header (navigation only) */}
      <div className="flex items-center gap-3">
        <BackButton to={`/project/${projectId}?tab=jobs`} />
        <h2 className="text-2xl font-bold text-gray-900">Job details</h2>
      </div>

      {/* Status Stepper */}
      <div className="bg-white shadow rounded-lg p-4">
        <JobStatusStepper current="Completed" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left */}
        <div className="lg:col-span-6 space-y-6">
          <JobDetailsInfoCard />
        </div>

        {/* Right */}
        <div className="lg:col-span-6 space-y-6">
          <AssignmentStatusCard />
          <ChecklistAnswersCard />
          <VendorRatingCard />
        </div>
      </div>
      <PayablesToVendorCard />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <LinkedInputFilesCard />
        </div>

        <div className="lg:col-span-6">
          <OutputFilesCard />
        </div>
      </div>
      <MessagesCard/>
    </div>
  );
};

export default JobDetailPage;
