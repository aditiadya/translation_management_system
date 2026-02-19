import { useEffect, useState } from "react";
import SetupWizard from "./SetupWizard";

const SetupWizardPage = () => {
  const [loading, setLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(false);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setSetupCompleted(data.setup_completed);
      } catch (err) {
        console.error("Error fetching setup status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSetupStatus();
  }, []);

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

  if (loading) {
    return (
      <div>
        <p className="text-center mt-10">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {setupCompleted ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-green-600 mt-4">
            Setup Completed
          </h2>
        </div>
      ) : (
        <SetupWizard onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default SetupWizardPage;