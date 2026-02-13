import { CheckCircle2, Circle, XCircle, AlertCircle } from "lucide-react";

const JobStatusStepper = ({ current, statusHistory = [] }) => {
  // Define all possible statuses in order
  const mainFlow = [
    "Draft",
    "Offered to Vendor",
    "Offer Accepted",
    "Started",
    "Completed",
    "Completion Accepted",
  ];

  // Alternative/rejection statuses
  const rejectionStatuses = ["Offer Rejected", "Completion Rejected", "Cancelled", "Hold"];

  const getCurrentStepIndex = () => {
    return mainFlow.findIndex(
      (step) => step.toLowerCase() === current?.toLowerCase()
    );
  };

  const isRejectionStatus = rejectionStatuses.some(
    (status) => status.toLowerCase() === current?.toLowerCase()
  );

  const currentIndex = getCurrentStepIndex();

  const getStepStatus = (index) => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  const getStatusIcon = (status, index) => {
    const stepStatus = getStepStatus(index);

    if (stepStatus === "completed") {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (stepStatus === "current") {
      if (isRejectionStatus) {
        return <XCircle className="w-5 h-5 text-red-600" />;
      }
      if (current === "Hold") {
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      }
      return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getStepStyles = (index) => {
    const stepStatus = getStepStatus(index);

    if (stepStatus === "completed") {
      return "bg-green-50 text-green-700 border-green-300";
    }
    if (stepStatus === "current") {
      if (isRejectionStatus) {
        return "bg-red-50 text-red-700 border-red-400 shadow-md";
      }
      if (current === "Hold") {
        return "bg-yellow-50 text-yellow-700 border-yellow-400 shadow-md";
      }
      return "bg-blue-600 text-white border-blue-600 shadow-lg";
    }
    return "bg-white text-gray-500 border-gray-300";
  };

  const getLineStyles = (index) => {
    if (index >= currentIndex) {
      return "bg-gray-300";
    }
    return "bg-green-500";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStepDate = (stepName) => {
    if (!statusHistory || statusHistory.length === 0) return null;
    
    const historyItem = statusHistory.find(
      (h) => h.new_status?.toLowerCase() === stepName.toLowerCase()
    );
    return historyItem?.changed_at;
  };

  return (
    <div className="w-full py-4">
      {/* Rejection Status Banner */}
      {isRejectionStatus && (
        <div className="mb-6 p-4 rounded-lg border-2 border-red-300 bg-red-50">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                Status: {current}
              </p>
              <p className="text-xs text-red-700 mt-1">
                This job has been {current.toLowerCase()}.
                {current === "Offer Rejected" && " You may re-offer to another vendor."}
                {current === "Completion Rejected" && " The vendor needs to revise and resubmit."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hold Status Banner */}
      {current === "Hold" && (
        <div className="mb-6 p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">
                Status: On Hold
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This job is temporarily paused. You can resume it anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="relative">
        <div className="flex items-start justify-between">
          {mainFlow.map((step, index) => {
            const stepDate = getStepDate(step);
            const isLast = index === mainFlow.length - 1;

            return (
              <div key={step} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center px-4 py-2.5 rounded-full border-2 transition-all duration-300 ${getStepStyles(
                      index
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step, index)}
                      <span className="text-xs font-semibold whitespace-nowrap">
                        {step}
                      </span>
                    </div>
                  </div>

                  {/* Date below step */}
                  {stepDate && (
                    <div className="mt-2 text-xs text-gray-500">
                      {formatDate(stepDate)}
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${getLineStyles(
                      index
                    )}`}
                    style={{ transform: "translateY(-50%)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status History Link */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              // TODO: Implement status history modal
              console.log("Show full status history");
            }}
          >
            View complete status history ({statusHistory.length} changes)
          </button>
        </div>
      )}
    </div>
  );
};

export default JobStatusStepper;