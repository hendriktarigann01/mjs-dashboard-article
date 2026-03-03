import { useState, useEffect } from "react";
import MainLayout from "./MainLayout";
import { ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import Pagination from "../components/Pagination";
import FolderIcon from "../icons/FolderIcon";
import { ArticleData } from "../data/ArticlesData";

const Draft = () => {
  const [activeTab, setActiveTab] = useState("project");
  const [page, setPage] = useState(1);
  const totalPages = 10;
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-action")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Sections */}
        <div className="flex bg-white rounded-lg shadow-sm items-center justify-between px-6 h-[68px]">
          <div className="flex items-center text-sm">
            <FolderIcon className="w-4 h-4 text-primary mr-2" />
            <span className="text-base font-semibold text-[#414853]">
              Drafts
            </span>
          </div>

          <div className="flex items-center text-xs">
            <FolderIcon className="w-4 h-4 text-primary mr-2" />
            <ChevronRight className="w-4 h-4 mr-2" />
            <span className="text-[#414853]">Drafts</span>
          </div>
        </div>

        {/* Draft Sections */}
        <div>
          {/* Option */}
          <div className="bg-transparent flex">
            <button
              onClick={() => setActiveTab("project")}
              className={`p-5 rounded-t-md flex items-center gap-2 ${
                activeTab === "project"
                  ? "bg-white text-primary font-semibold"
                  : "text-gray-500"
              }`}
            >
              <span>Project</span>
              <span className="rounded-lg text-white h-6 w-6 text-sm bg-primary flex items-center justify-center">
                5
              </span>
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`p-5 rounded-t-md flex items-center gap-2 ${
                activeTab === "news"
                  ? "bg-white text-primary font-semibold"
                  : "text-gray-500"
              }`}
            >
              <span>News</span>
              <span className="rounded-lg text-white h-6 w-6 text-sm bg-primary flex items-center justify-center">
                6
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-lg shadow-sm p-2 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
              {/* Left */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-4 space-y-6">
                  {ArticleData.map((article) => {
                    const uniqueId = `left-${article.id}`;
                    return (
                      <div
                        key={uniqueId}
                        className="relative flex items-start space-x-4"
                      >
                        <div className="w-[157px] h-[90px] sm:w-[120px] sm:h-[70px] xs:w-[100px] xs:h-[60px] bg-[#9E9E9E] rounded-lg flex-shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 leading-5">
                            {article.title}
                          </h4>
                          <p className="text-xs md:text-sm text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
                            {article.description}
                          </p>
                          <p className="text-xs md:text-sm text-[#9E9E9E] mt-2">
                            {article.date}
                          </p>
                        </div>

                        <div className="relative dropdown-action">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === uniqueId ? null : uniqueId
                              )
                            }
                            className="p-1"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openDropdownId === uniqueId && (
                            <div className="absolute mt-2 right-0 w-44 md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <button
                                onClick={() => {
                                  console.log("Continue Writing");
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <img
                                  src="/icons/edit.svg"
                                  className="w-4 h-4 mr-3 text-red-500"
                                />
                                Continue Writing
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete Draft");
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-red-500 hover:bg-red-50"
                              >
                                <img
                                  src="/icons/delete.svg"
                                  className="w-4 h-4 mr-3 text-red-500"
                                />
                                Delete Draft
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-4 space-y-6">
                  {ArticleData.map((article) => {
                    const uniqueId = `right-${article.id}`;
                    return (
                      <div
                        key={uniqueId}
                        className="relative flex items-start space-x-4"
                      >
                        <div className="w-[157px] h-[90px] sm:w-[120px] sm:h-[70px] xs:w-[100px] xs:h-[60px] bg-[#9E9E9E] rounded-lg flex-shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 leading-5">
                            {article.title}
                          </h4>
                          <p className="text-xs md:text-sm text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
                            {article.description}
                          </p>
                          <p className="text-xs md:text-sm text-[#9E9E9E] mt-2">
                            {article.date}
                          </p>
                        </div>

                        <div className="relative dropdown-action">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === uniqueId ? null : uniqueId
                              )
                            }
                            className="p-1"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openDropdownId === uniqueId && (
                            <div className="absolute mt-2 right-0 w-44 md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <button
                                onClick={() => {
                                  console.log("Continue Writing");
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <img
                                  src="/icons/edit.svg"
                                  className="w-4 h-4 mr-3 text-red-500"
                                />
                                Continue Writing
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete Draft");
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-red-500 hover:bg-red-50"
                              >
                                <img
                                  src="/icons/delete.svg"
                                  className="w-4 h-4 mr-3 text-red-500"
                                />
                                Delete Draft
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Draft;
