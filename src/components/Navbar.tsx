import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaBell,
  FaUser,
  FaSearch,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New order received", time: "2 min ago" },
    { id: 2, text: "Product stock low", time: "1 hour ago" },
    { id: 3, text: "Daily report ready", time: "3 hours ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white shadow-sm h-16 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
        >
          <FaBars className="h-5 w-5 text-gray-500" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary w-64"
          />
          <FaSearch className="absolute left-4 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <FaBell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border">
              <h3 className="px-4 py-2 text-sm font-semibold border-b">
                Notifications
              </h3>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t px-4 py-2">
                <button className="text-sm text-brand-primary hover:text-brand-hover w-full text-center">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <FaUser className="h-4 w-4 text-brand-primary" />
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">
              {user?.email}
            </span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
              <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <FaCog className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
