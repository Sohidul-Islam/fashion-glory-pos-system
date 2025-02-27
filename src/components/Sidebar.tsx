import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import { menuItems } from "../config/menuItems";
import LogoSvg from "./icons/LogoSvg";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  // Close sidebar on mobile when navigating screen sizes.
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, setIsOpen]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isMenuActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-white shadow-lg w-sidebar">
      <div className="h-16 flex items-center justify-center border-b">
        <LogoSvg className="h-[90px]" />
      </div>

      <nav className="mt-4 h-[calc(100vh-4rem)] overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              // Menu with submenu
              <div>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200 ${
                    isMenuActive(item.path)
                      ? "text-brand-primary"
                      : "text-gray-700 hover:text-brand-primary hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{item.icon}</span>
                    {isOpen && <span>{item.title}</span>}
                  </div>
                  {isOpen && (
                    <span
                      className={`transform transition-transform duration-200 text-gray-500 ${
                        expandedMenus.includes(item.id) ? "rotate-180" : ""
                      }`}
                    >
                      <FaChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </button>
                {/* Submenu with animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen && expandedMenus.includes(item.id)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 py-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.id}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-4 px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                            isActive
                              ? "text-brand-primary bg-brand-primary/10"
                              : "text-gray-700 hover:text-brand-primary hover:bg-gray-50"
                          }`
                        }
                      >
                        <span className="text-gray-500">{subItem.icon}</span>
                        <span>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Single menu item
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-4 px-4 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-brand-primary bg-brand-primary/10"
                      : "text-gray-700 hover:text-brand-primary hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-gray-500">{item.icon}</span>
                {isOpen && <span>{item.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
