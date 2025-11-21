import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
  // 1. State persistence logic
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebar-open");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-open", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- NAVBAR SECTION --- */}
      {/* fixed: Sticks to top. 
          h-16: Sets explicit height (4rem). 
          z-50: Ensures it floats above everything else. */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* --- SIDEBAR SECTION --- */}
      {/* The Sidebar component itself (based on your code) is likely 'fixed' 
          and has 'top-16'. We just render it here. 
          It will sit below the Navbar because of 'top-16' in your Sidebar.jsx */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* --- MAIN CONTENT SECTION --- */}
      {/* This is where the magic happens to fix the gaps: */}
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
        {/* INNER CONTENT CONTAINER */}
        {/* We add p-8 here so every page has consistent padding inside the gray area */}
        <div className="p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;