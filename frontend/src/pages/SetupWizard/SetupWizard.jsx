import { lazy, Suspense, useState } from "react";

const ServicesStep = lazy(() => import("./ServicesStep"));
const PaymentMethodStep = lazy(() => import("./PaymentMethodStep"));
const LanguagePairsStep = lazy(() => import("./LanguagePairsStep"));
const UnitsStep = lazy(() => import("./UnitsStep"));
const SpecializationsStep = lazy(() => import("./SpecializationsStep"));
const CurrenciesStep = lazy(() => import("./CurrenciesStep"));

const stepConfigs = [
  { name: "Services", Component: ServicesStep, dataKey: "services" },
  {
    name: "Language Pairs",
    Component: LanguagePairsStep,
    dataKey: "languagePairs",
  },
  { name: "Units", Component: UnitsStep, dataKey: "units" },
  {
    name: "Specializations",
    Component: SpecializationsStep,
    dataKey: "specializations",
  },
  { name: "Currencies", Component: CurrenciesStep, dataKey: "currencies" },
  {
    name: "Payment Methods",
    Component: PaymentMethodStep,
    dataKey: "paymentMethods",
  },
];

const Stepper = ({ steps, currentStep, highestStep, goToStep }) => {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      {steps.map((step, index) => {
        const isCompleted = index < highestStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= highestStep;

        return (
          <div
            key={step.name}
            className="flex flex-col items-center flex-1 relative"
          >
            <div
              onClick={() => isClickable && goToStep(index)}
              className={`z-10 w-4 h-4 rounded-full transition-all duration-500
                ${
                  isCompleted
                    ? "bg-green-500 shadow-[0_0_1px_1px_rgba(34,197,94,0.7)]"
                    : ""
                }
                ${
                  isCurrent
                    ? "bg-blue-500 shadow-[0_0_1px_1px_rgba(59,130,246,0.7)] scale-110"
                    : ""
                }
                ${
                  !isCompleted && !isCurrent
                    ? "bg-gray-300 shadow-[0_0_6px_1px_rgba(156,163,175,0.5)]"
                    : ""
                }
                ${
                  isClickable
                    ? "cursor-pointer hover:scale-110"
                    : "cursor-not-allowed opacity-60"
                }
              `}
            ></div>

            {index < steps.length - 1 && (
              <div
                className={`absolute top-[8px] left-1/2 h-0.5 w-full -translate-y-1/2 z-0 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}

            <div
              className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                isCurrent
                  ? "text-blue-600"
                  : isCompleted
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              {step.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SetupWizard = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(0);

  const [wizardData, setWizardData] = useState({
    services: [],
    paymentMethods: [],
    languagePairs: [],
    units: [],
    specializations: [],
    currencies: [],
  });

  const nextStep = () => {
    const newStep = currentStep + 1;
    if (newStep < stepConfigs.length) {
      setCurrentStep(newStep);
      setHighestStepVisited(Math.max(highestStepVisited, newStep));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex <= highestStepVisited) {
      setCurrentStep(stepIndex);
    }
  };

  const { Component, dataKey } = stepConfigs[currentStep];
  const isLastStep = currentStep === stepConfigs.length - 1;

  return (
    <div className="w-full my-10 p-6">
      <div className="w-full max-w-5xl mx-auto">
        <Stepper
          steps={stepConfigs}
          currentStep={currentStep}
          highestStep={highestStepVisited}
          goToStep={goToStep}
        />

        <div
          className="mx-auto border rounded-2xl shadow-lg bg-white"
          style={{ width: "100%", maxWidth: "1000px", height: "400px" }}
        >
          <Suspense
            fallback={
              <div className="text-center py-10 text-gray-500">Loading...</div>
            }
          >
            <Component
              data={wizardData[dataKey]}
              setData={(data) =>
                setWizardData({ ...wizardData, [dataKey]: data })
              }
              onNext={isLastStep ? () => onSubmit(wizardData) : nextStep}
              onBack={currentStep > 0 ? prevStep : undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;