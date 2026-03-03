import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Dot } from "lucide-react";
import DashboardIcon from "../icons/DashboardIcon";
import WriteIcon from "../icons/WriteIcon";
import AssignmentIcon from "../icons/PublishedIcon";
import FolderIcon from "../icons/FolderIcon";

const Navbar = ({ isOpen, onClose }) => {
  const [dropdownOpen, setDropdownOpen] = useState(true); // Set default true
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: DashboardIcon,
      label: "Dashboard",
      active: location.pathname === "/dashboard",
      path: "/dashboard",
    },
    {
      icon: WriteIcon,
      label: "Write",
      active: location.pathname.startsWith("/write"),
      path: "/write",
      hasDropdown: true,
      dropdownItems: [
        {
          icon: Dot,
          label: "Create News",
          path: "/write/create-news",
        },
        {
          icon: Dot,
          label: "Create Project",
          path: "/write/create-project",
        },
      ],
    },
    {
      icon: AssignmentIcon,
      label: "Published",
      active: location.pathname === "/published",
      path: "/published",
    },
    {
      icon: FolderIcon,
      label: "Drafts",
      active: location.pathname === "/drafts",
      path: "/drafts",
    },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleItemClick = (item) => {
    if (item.hasDropdown) {
      toggleDropdown();
    } else {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const handleDropdownItemClick = (dropdownItem) => {
    navigate(dropdownItem.path);
    // Tidak menutup dropdown dan navbar - biarkan tetap terbuka
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                    z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                    fixed inset-y-0 left-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:sticky md:top-0 md:translate-x-0 md:h-screen
                  `}
      >
        <div className="flex flex-col h-full pt-16 md:pt-0">
          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-4 bg-white">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <div>
                    {/* Main menu item */}
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center justify-between px-4 py-4 text-sm font-medium rounded-md transition-colors duration-150
                      ${
                        item.active
                          ? "bg-secondary text-primary border-r-2 border-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          active={item.active}
                          className="mr-3 h-5 w-5 flex-shrink-0"
                        />
                        {item.label}
                      </div>

                      {item.hasDropdown && (
                        <div className="transition-transform duration-200">
                          {dropdownOpen ? (
                            <ChevronDown
                              className={`h-4 w-4 ${
                                item.active ? "text-primary" : "text-gray-400"
                              }`}
                            />
                          ) : (
                            <ChevronRight
                              className={`h-4 w-4 ${
                                item.active ? "text-primary" : "text-gray-400"
                              }`}
                            />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Dropdown items */}
                    {item.hasDropdown && dropdownOpen && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                        {item.dropdownItems.map(
                          (dropdownItem, dropdownIndex) => (
                            <button
                              key={dropdownIndex}
                              onClick={() =>
                                handleDropdownItemClick(dropdownItem)
                              }
                              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                                location.pathname === dropdownItem.path
                                  ? "text-primary bg-gray-50"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <dropdownItem.icon
                                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                  location.pathname === dropdownItem.path
                                    ? "text-primary"
                                    : "text-gray-400"
                                }`}
                              />{" "}
                              {dropdownItem.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
