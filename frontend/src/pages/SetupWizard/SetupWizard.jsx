import React, { lazy, Suspense, useState } from "react";

const ServicesStep = lazy(() => import("./ServicesStep"));
const PaymentMethodStep = lazy(() => import("./PaymentMethodStep"));
const LanguagePairsStep = lazy(() => import("./LanguagePairsStep"));
const UnitsStep = lazy(() => import("./UnitsStep"));
const SpecializationsStep = lazy(() => import("./SpecializationsStep"));
const CurrenciesStep = lazy(() => import("./CurrenciesStep"));

const SetupWizard = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [wizardData, setWizardData] = useState({
    services: [],
    paymentMethods: [],
    languagePairs: [],
    units: [],
    specializations: [],
    currencies: [],
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    <ServicesStep
      data={wizardData.services}
      setData={(services) => setWizardData({ ...wizardData, services })}
      onNext={nextStep}
    />,
    <LanguagePairsStep
      data={wizardData.languagePairs}
      setData={(languagePairs) =>
        setWizardData({ ...wizardData, languagePairs })
      }
      onNext={nextStep}
      onBack={prevStep}
    />,
    <UnitsStep
      data={wizardData.units}
      setData={(units) => setWizardData({ ...wizardData, units })}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <SpecializationsStep
      data={wizardData.specializations}
      setData={(specializations) =>
        setWizardData({ ...wizardData, specializations })
      }
      onNext={nextStep}
      onBack={prevStep}
    />,
    <CurrenciesStep
      data={wizardData.currencies}
      setData={(currencies) => setWizardData({ ...wizardData, currencies })}
      onNext={nextStep}
      onBack={prevStep}
      
    />,
    <PaymentMethodStep
      data={wizardData.paymentMethods}
      setData={(paymentMethods) =>
        setWizardData({ ...wizardData, paymentMethods })
      }
      onNext={() => onSubmit(wizardData)}
      onBack={prevStep}
    />
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {steps[currentStep]}
    </Suspense>
  );
};

export default SetupWizard;
