import { useState } from "react";
import Header from "../navbar/Header";
import Navbar from "../navbar/Navbar";
import Alert from "../components/Alert";

const MainLayout = ({ children, showNavbar = true, showSearch = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col bg-[#F8F8F8]">
      <Header onMenuToggle={toggleSidebar} showSearch={showSearch} />

      <div className="flex flex-1 overflow-hidden">
        {showNavbar && <Navbar isOpen={isSidebarOpen} onClose={closeSidebar} />}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
