const steps = [
  "Draft",
  "Offered to vendor",
  "Offer accepted",
  "Started",
  "Completed",
  "Completion accepted",
];

const JobStatusStepper = ({ current }) => {
  const currentIndex = steps.indexOf(current);

  return (
    <div className="w-full">
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-10" />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step}
              className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition
                ${
                  isCompleted
                    ? "bg-teal-100 text-teal-700 border-teal-400"
                    : isCurrent
                    ? "bg-teal-600 text-white border-teal-600 shadow"
                    : "bg-white text-gray-500 border-gray-300"
                }
              `}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobStatusStepper;