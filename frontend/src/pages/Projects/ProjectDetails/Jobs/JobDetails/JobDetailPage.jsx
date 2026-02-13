import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";
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
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${jobId}`, {
          withCredentials: true,
        });
        setJob(response.data.data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Refresh job data
  const refreshJob = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`, {
        withCredentials: true,
      });
      setJob(response.data.data);
    } catch (err) {
      console.error("Failed to refresh job:", err);
    }
  };

  // Handler: Download PO
  const handleDownloadPO = () => {
    // TODO: Implement PO download
    console.log("Downloading PO for job:", jobId);
    alert("PO download feature coming soon!");
  };

  // Handler: Clone job
  const handleClone = () => {
    navigate(`/project/${projectId}/create-job?clone=${jobId}`);
  };

  // Handler: Update job
  const handleUpdate = () => {
    navigate(`/project/${projectId}/job/${jobId}/edit`);
  };

  // Handler: Delete job
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`, { withCredentials: true });
      alert("Job deleted successfully");
      navigate(`/project/${projectId}?tab=jobs`);
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Failed to delete job");
    }
  };

  // Handler: Status changes
  const handleStatusChange = async (newStatus, comment = "") => {
    try {
      await api.post(
        `/jobs/${jobId}/status`,
        {
          new_status: newStatus,
          comment: comment,
          changed_by: "admin",
        },
        { withCredentials: true }
      );
      await refreshJob();
      alert(`Job status changed to ${newStatus}`);
    } catch (err) {
      console.error("Failed to change status:", err);
      alert(err.response?.data?.message || "Failed to change job status");
    }
  };

  const handleOffer = () => handleStatusChange("Offered to Vendor");
  const handleStart = async () => {
    try {
      await api.post(`/jobs/${jobId}/start`, {}, { withCredentials: true });
      await refreshJob();
      alert("Job started successfully");
    } catch (err) {
      console.error("Failed to start job:", err);
      alert(err.response?.data?.message || "Failed to start job");
    }
  };
  const handleAccept = () => handleStatusChange("Completion Accepted");
  const handleReject = () => {
    const comment = prompt("Enter reason for rejection:");
    if (comment !== null) {
      handleStatusChange("Completion Rejected", comment);
    }
  };
  const handleCancel = () => {
    const comment = prompt("Enter reason for cancellation:");
    if (comment !== null) {
      handleStatusChange("Cancelled", comment);
    }
  };
  const handleDraft = () => handleStatusChange("Draft");

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading job details...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );
  }

  if (!job) {
    return (
      <div className="text-center mt-10 text-gray-500">Job not found.</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header (navigation only) */}
      <div className="flex items-center gap-3">
        <BackButton to={`/project/${projectId}?tab=jobs`} />
        <h2 className="text-2xl font-bold text-gray-900">Job details</h2>
      </div>

      {/* Status Stepper */}
      <div className="bg-white shadow rounded-lg p-4">
        <JobStatusStepper current={job.status} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left */}
        <div className="lg:col-span-6 space-y-6">
          <JobDetailsInfoCard
            job={job}
            onDownloadPO={handleDownloadPO}
            onClone={handleClone}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Right */}
        <div className="lg:col-span-6 space-y-6">
          <AssignmentStatusCard
            job={job}
            onAccept={handleAccept}
            onReject={handleReject}
            onCancel={handleCancel}
            onDraft={handleDraft}
            onOffer={handleOffer}
            onStart={handleStart}
          />
          <ChecklistAnswersCard job={job} />
          <VendorRatingCard job={job} />
        </div>
      </div>

      <PayablesToVendorCard job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <LinkedInputFilesCard job={job} />
        </div>

        <div className="lg:col-span-6">
          <OutputFilesCard job={job} />
        </div>
      </div>

      <MessagesCard job={job} />
    </div>
  );
};

export default JobDetailPage;