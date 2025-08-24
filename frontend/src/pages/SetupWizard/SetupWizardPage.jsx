import React from "react";
import SetupWizard from "./SetupWizard";

const SetupWizardPage = () => {
  const handleSubmit = async (data) => {
    console.log("Wizard data to submit:", data);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/setup-completed",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log(result);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error submitting wizard:", err);
    }
  };

  return (
    <div>
      <SetupWizard onSubmit={handleSubmit} />
    </div>
  );
};

export default SetupWizardPage;
