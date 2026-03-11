import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import { ChevronRight, Search } from "lucide-react";
import Pagination from "../components/Pagination";
import Card from "../components/Card";
import PublishedIcon from "../icons/PublishedIcon";
import api from "../lib/api";

const ITEMS_PER_PAGE = 10;

const Published = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("project");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({ project: 0, news: 0 });
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const endpoint =
    activeTab === "project" ? "/projects/get-project" : "/news/get-news";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endpoint}?status=published`);
      setData(res.data);
      setCounts((prev) => ({ ...prev, [activeTab]: res.data.length }));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const [projects, news] = await Promise.all([
          api.get("/projects/get-project?status=published"),
          api.get("/news/get-news?status=published"),
        ]);
        setCounts({ project: projects.data.length, news: news.data.length });
      } catch (_) {}
    };
    fetchAllCounts();
  }, []);

  useEffect(() => {
    setPage(1);
    setSearchQuery("");
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-action")) setOpenDropdownId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUnpublish = async (id) => {
    setActionLoading(id);
    try {
      const updateEndpoint =
        activeTab === "project"
          ? `/projects/update-project/${id}`
          : `/news/update-news/${id}`;
      await api.put(updateEndpoint, { status: "draft" });
      fetchData();
    } catch (err) {
      console.error("Unpublish error:", err);
    } finally {
      setActionLoading(null);
      setOpenDropdownId(null);
    }
  };

  const handleEdit = (item) => {
    setOpenDropdownId(null);
    const route =
      activeTab === "project"
        ? `/write/edit-project/${item._id}`
        : `/write/edit-news/${item._id}`;
    navigate(route);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus item ini?")) return;
    setActionLoading(id);
    try {
      const delEndpoint =
        activeTab === "project"
          ? `/projects/delete-project/${id}`
          : `/news/delete-news/${id}`;
      await api.delete(delEndpoint);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoading(null);
      setOpenDropdownId(null);
    }
  };

  const filtered = searchQuery.trim()
    ? data.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description
            ?.replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : data;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const half = Math.ceil(paginated.length / 2);
  const leftCol = paginated.slice(0, half);
  const rightCol = paginated.slice(half);
  const imageKey = activeTab === "project" ? "image_project" : "image_news";

  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Bar */}
        <div className="flex bg-white rounded-lg shadow-sm items-center justify-between px-6 h-[68px]">
          <div className="flex justify-between w-auto gap-8">
            <div className="flex items-center text-sm">
              <PublishedIcon className="w-5 h-5 fill-current text-[#3AAFA9] mr-4" />
              <span className="text-base font-semibold text-[#414853]">
                Published
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs">
            <PublishedIcon className="w-4 h-4 fill-current text-[#3AAFA9] mr-2" />
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Published</span>
          </div>
        </div>

        <div>
          {/* Tabs */}
          <div className="bg-transparent flex">
            {["project", "news"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-5 rounded-t-md flex items-center gap-2 ${
                  activeTab === tab ? "bg-white text-primary" : "text-gray-500"
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className="rounded-lg text-white h-6 w-6 text-sm bg-primary flex items-center justify-center">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-lg shadow-sm p-2 md:p-6">
            {/* Search */}
            <div className="hidden md:flex w-full justify-end">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AAFA9]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <PublishedIcon className="w-12 h-12 mb-3 text-gray-200" />
                <p className="text-sm">
                  {searchQuery ? "Tidak ada hasil" : "Belum ada yang dipublish"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
                <div className="space-y-6 px-4">
                  {leftCol.map((item) => (
                    <Card
                      key={item._id}
                      item={item}
                      imageKey={imageKey}
                      mode="published"
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      actionLoading={actionLoading}
                      onUnpublish={handleUnpublish}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <div className="space-y-6 px-4">
                  {rightCol.map((item) => (
                    <Card
                      key={item._id}
                      item={item}
                      imageKey={imageKey}
                      mode="published"
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      actionLoading={actionLoading}
                      onUnpublish={handleUnpublish}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Published;
