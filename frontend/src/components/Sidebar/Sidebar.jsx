import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiChevronLeft,
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navLinks = [
    { to: "/", icon: FiHome, label: "Dashboard", category: "main" },
    { to: "/profile", icon: FiUser, label: "My Profile", category: "main" },
    
    // Management Section
    { to: "/managers", icon: FiUsers, label: "Managers", category: "management" },
    { to: "/clients", icon: FiUsers, label: "Clients", category: "management" },
    { to: "/vendors", icon: FiUsers, label: "Vendors", category: "management" },
    { to: "/client-pools", icon: FiGrid, label: "Client Pools", category: "management" },
    
    // Operations Section
    { to: "/projects", icon: FiBriefcase, label: "Projects", category: "operations" },
    { to: "/jobs", icon: FiBriefcase, label: "Jobs", category: "operations" },
    
    // System Section
    { to: "/system-values", icon: FiBarChart2, label: "System Values", category: "system" },
    { to: "/settings", icon: FiSettings, label: "Settings", category: "system" },
  ];

  const groupedLinks = {
    main: navLinks.filter(link => link.category === "main"),
    management: navLinks.filter(link => link.category === "management"),
    operations: navLinks.filter(link => link.category === "operations"),
    system: navLinks.filter(link => link.category === "system"),
  };

  const renderSection = (label, links) => (
    <>
      {isOpen && (
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </p>
      )}
      {links.map((link) => (
        <NavLink to={link.to} className={linkClasses} key={link.to}>
          <link.icon size={22} className="flex-shrink-0" />
          {isOpen && <span>{link.label}</span>}
        </NavLink>
      ))}
    </>
  );

  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-4 w-full p-3 rounded-lg font-medium transition-all duration-200 group
     ${
       isActive
         ? "bg-blue-100 text-blue-700"
         : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
     }`;

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 
        bg-white border-r shadow-sm transition-all duration-300 ease-in-out 
        flex flex-col justify-between
        overflow-y-auto overflow-x-hidden
        ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          localStorage.setItem("sidebar-open", newState);
        }}
        className="absolute -right-3 top-9 z-10 p-1.5 bg-white border rounded-full shadow-md hover:bg-gray-100 transition-transform duration-300"
      >
        <FiChevronLeft
          className={`transition-transform duration-300 ${
            !isOpen && "rotate-180"
          }`}
        />
      </button>

      {/* Top Section */}
      <div className="p-4 space-y-4">
        <nav className="flex flex-col space-y-2">
          {/* Main */}
          {renderSection("", groupedLinks.main)}
        </nav>

        <nav className="flex flex-col space-y-2 border-t pt-4">
          {/* Management */}
          {renderSection(isOpen ? "Management" : "", groupedLinks.management)}
        </nav>

        <nav className="flex flex-col space-y-2 border-t pt-4">
          {/* Operations */}
          {renderSection(isOpen ? "Operations" : "", groupedLinks.operations)}
        </nav>

        <nav className="flex flex-col space-y-2 border-t pt-4">
          {/* System */}
          {renderSection(isOpen ? "System" : "", groupedLinks.system)}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;