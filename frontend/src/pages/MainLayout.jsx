import { useState } from "react";
import Header from "../navbar/Header";
import Navbar from "../navbar/Navbar";
import Alert from "../components/Alert";

const MainLayout = ({ children, showNavbar = true, showSearch = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header onMenuToggle={toggleSidebar} showSearch={showSearch} />

      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr]">
        {showNavbar && <Navbar isOpen={isSidebarOpen} onClose={closeSidebar} />}

        <main className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
