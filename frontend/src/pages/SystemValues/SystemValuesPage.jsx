import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const systemOptions = [
  { name: "Services", path: "/system-values/services" },
  { name: "Language Pairs", path: "/system-values/language-pairs" },
  { name: "Specializations", path: "/system-values/specializations" },
  { name: "Units", path: "/system-values/units" },
  { name: "Currencies", path: "/system-values/currencies" },
  { name: "Payment Methods", path: "/system-values/payment-methods" },
];

const SystemValuesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">System Values</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemOptions.map((option) => (
            <div
              key={option.name}
              onClick={() => handleNavigate(option.path)}
              className="cursor-pointer bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl transition"
            >
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {option.name}
              </p>
              <span className="text-gray-500 text-sm">
                Click to manage {option.name.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default SystemValuesPage;