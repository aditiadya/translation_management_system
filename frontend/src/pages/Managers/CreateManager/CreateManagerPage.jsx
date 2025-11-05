import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import CreateManagerForm from "./CreateManagerForm";
import BackButton from "../../../components/Button/BackButton";

const CreateManagerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <BackButton to="/managers" />
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Manager
            </h1>
          </div>

          <CreateManagerForm />
        </div>
      </main>
    </>
  );
};

export default CreateManagerPage;