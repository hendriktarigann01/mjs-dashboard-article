import { useState, useEffect } from "react";
import { MoreHorizontal, ChevronRight, FileText, Eye } from "lucide-react";
import MainLayout from "./MainLayout";
import Chart from "../components/Chart";
import DashboardIcon from "../icons/DashboardIcon";
import api from "../lib/api";
import { getFirstImage } from "../helpers/image-helper.js";

const stripHtml = (html) =>
  html
    ?.replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim() ?? "";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Years");

  const [stats, setStats] = useState({ totalPublished: 0, totalViews: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [lastDrafts, setLastDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);

  const [lastPublished, setLastPublished] = useState([]);
  const [publishedLoading, setPublishedLoading] = useState(true);

  const [draftCount, setDraftCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    // Fetch stats terpisah — tidak blokir data artikel jika gagal
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    // Fetch artikel draft + published
    const fetchArticles = async () => {
      try {
        const [draftNews, draftProjects, pubNews, pubProjects] =
          await Promise.all([
            api.get("/news/get-news?status=draft"),
            api.get("/projects/get-project?status=draft"),
            api.get("/news/get-news?status=published"),
            api.get("/projects/get-project?status=published"),
          ]);

        const allDrafts = [
          ...draftNews.data.map((i) => ({
            ...i,
            _type: "news",
            _image: getFirstImage(i.image_news),
          })),
          ...draftProjects.data.map((i) => ({
            ...i,
            _type: "project",
            _image: getFirstImage(i.image_project),
          })),
        ]
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 2);

        const allPublished = [
          ...pubNews.data.map((i) => ({
            ...i,
            _type: "news",
            _image: getFirstImage(i.image_news),
          })),
          ...pubProjects.data.map((i) => ({
            ...i,
            _type: "project",
            _image: getFirstImage(i.image_project),
          })),
        ]
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 2);

        setLastDrafts(allDrafts);
        setDraftCount(draftNews.data.length + draftProjects.data.length);
        setLastPublished(allPublished);
        setPublishedCount(pubNews.data.length + pubProjects.data.length);
      } catch (err) {
        console.error("Articles fetch error:", err);
      } finally {
        setDraftsLoading(false);
        setPublishedLoading(false);
      }
    };

    fetchStats();
    fetchArticles();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const ArticleCard = ({ item }) => (
    <div className="flex items-start space-x-4">
      <div className="w-[157px] h-[90px] bg-[#9E9E9E] rounded-lg flex-shrink-0 overflow-hidden">
        {item._image && (
          <img
            src={item._image}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
          {item.title}
        </h4>
        <p className="text-xs text-[#9E9E9E] line-clamp-2 leading-4">
          {stripHtml(item.description)}
        </p>
        <p className="text-xs text-[#9E9E9E] ">
          {formatDate(item.updated_at)}
        </p>
      </div>
      <button className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );

  const SkeletonCard = () => (
    <div className="flex items-start space-x-4 animate-pulse">
      <div className="w-[157px] h-[90px] bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Bar */}
        <div className="flex bg-white rounded-lg shadow-sm items-center justify-between px-6 h-[68px]">
          <div className="flex items-center text-sm">
            <DashboardIcon className="w-5 h-5 fill-current text-[#3AAFA9] mr-4" />
            <span className="text-base font-semibold text-[#414853]">
              Dashboard
            </span>
          </div>
          <div className="flex items-center text-xs">
            <DashboardIcon className="w-4 h-4 fill-current text-[#3AAFA9] mr-2" />
            <ChevronRight className="w-4 h-4 mr-2" />
            <span className="text-[#414853]">Dashboard</span>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cards — Mobile & Desktop */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            {/* Total Publish */}
            <div className="bg-white rounded-xl shadow p-4 lg:p-6 flex lg:items-center">
              <div className="flex items-center gap-4 lg:gap-8 w-full">
                <div className="min-w-0">
                  <p className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? (
                      <span className="inline-block w-10 h-7 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      stats.totalPublished
                    )}
                  </p>
                  <p className="text-sm text-[#9E9E9E]">Total Publish</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md flex items-center justify-center bg-[#E6F8F7] flex-shrink-0 ml-auto lg:ml-0">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-[#3AAFA9]" />
                </div>
              </div>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-xl shadow p-4 lg:p-6 flex lg:items-center">
              <div className="flex items-center gap-4 lg:gap-8 w-full">
                <div className="min-w-0">
                  <p className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? (
                      <span className="inline-block w-10 h-7 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      stats.totalViews
                    )}
                  </p>
                  <p className="text-sm text-[#9E9E9E]">Total Views</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md flex items-center justify-center bg-[#EEF2FF] flex-shrink-0 ml-auto lg:ml-0">
                  <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#414853]">
                  Analytics Summary
                </h2>
                <div className="relative">
                  <select
                    className="border border-[#9E9E9E] cursor-pointer rounded-md px-3 py-1.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="Years">Years</option>
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#9E9E9E] pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <Chart selectedPeriod={selectedPeriod} />
            </div>
          </div>
        </div>

        {/* Last Drafts & Last Published */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last Drafts */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Last Drafts
                </h3>
                <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                  {draftCount}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {draftsLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : lastDrafts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  Tidak ada draft
                </p>
              ) : (
                lastDrafts.map((item) => (
                  <ArticleCard key={item._id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Last Published */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Last Published
                </h3>
                <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                  {publishedCount}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {publishedLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : lastPublished.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  Belum ada yang dipublish
                </p>
              ) : (
                lastPublished.map((item) => (
                  <ArticleCard key={item._id} item={item} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
