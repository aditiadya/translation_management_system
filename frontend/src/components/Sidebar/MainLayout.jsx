import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebar-open");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-open", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      
 
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-sm">
        <Navbar />
      </div>

    
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

 
      <main
        className={`
          min-h-screen
          transition-all duration-300 ease-in-out
          
          /* TOP SPACING: Push content down by 16 (4rem) so it doesn't hide behind Navbar */
          pt-16 

          /* LEFT SPACING: Push content right based on sidebar state */
          ${isSidebarOpen ? "ml-64" : "ml-20"}
        `}
      >
 
        <div className="p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;