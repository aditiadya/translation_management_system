import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiChevronLeft,
  FiGrid,
  FiUsers,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navLinks = [
    { to: "/", icon: FiHome, label: "Dashboard" },
    { to: "/profile", icon: FiUser, label: "My Profile" },
    { to: "/managers", icon: FiGrid, label: "Managers" },
    { to: "/clients", icon: FiSettings, label: "Clients" },
    { to: "/client-pools", icon: FiUsers, label: "Client Pools" },
    { to: "/system-values", icon: FiUsers, label: "System Values" },
    { to: "/vendors", icon: FiUsers, label: "Vendors" },
    { to: "/projects", icon: FiUsers, label: "Projects" },
    { to: "/jobs", icon: FiUsers, label: "Jobs" },
  ];

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
      <div className="p-4">
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink to={link.to} className={linkClasses} key={link.to}>
              <link.icon size={22} className="flex-shrink-0" />
              {isOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section
      <div className="border-t pr-6 pt-3 pb-3">
        <div className="flex items-center w-full group">
          {isOpen && (
            <div className="ml-3 whitespace-nowrap">
              <p className="text-sm font-semibold text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          )}
          <button className="ml-auto p-2 rounded-lg text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200">
            <FiLogOut size={20} />
          </button>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;