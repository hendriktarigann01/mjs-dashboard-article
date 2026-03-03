import { useState } from "react";
import { MoreHorizontal, ChevronRight } from "lucide-react";
import MainLayout from "./MainLayout";
import { CardData } from "../data/CardData";
import { ChartData } from "../data/ChartData";
import { ArticleData } from "../data/ArticlesData";
import Chart from "../components/Chart";
import DashboardIcon from "../icons/DashboardIcon";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Years");

  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Sections */}
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

        {/* Analytic Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Mobile Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:hidden">
            {CardData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm text-[#9E9E9E]">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Desktop Cards */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="flex flex-col gap-6 h-full">
              {CardData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-6 h-full flex items-center"
                >
                  <div className="flex items-center gap-8 w-full">
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-[#9E9E9E]">{stat.title}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-md flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              ))}
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
                    className="border border-[#9E9E9E] cursor-pointer rounded-md px-3 py-1.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white w-full"
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
              <Chart data={ChartData} selectedPeriod={selectedPeriod} />
            </div>
          </div>
        </div>

        {/* Published Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 mr-3">
                  Last Drafts
                </h3>
                <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                  20
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {ArticleData.map((article) => (
                <div key={article.id} className="flex items-start space-x-4">
                  <div className="w-[157px] h-[90px] bg-[#9E9E9E] rounded-lg flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
                      {article.description}
                    </p>
                    <p className="text-xs text-[#9E9E9E] mt-2">
                      {article.date}
                    </p>
                  </div>
                  <button className="text-gray-900 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 mr-3">
                  Last article
                </h3>
                <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                  20
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {ArticleData.map((article) => (
                <div key={article.id} className="flex items-start space-x-4">
                  <div className="w-[157px] h-[90px] bg-[#9E9E9E] rounded-lg flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
                      {article.description}
                    </p>
                    <p className="text-xs text-[#9E9E9E] mt-2">
                      {article.date}
                    </p>
                  </div>
                  <button className="text-gray-900 hover:text-[#9E9E9E] p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
