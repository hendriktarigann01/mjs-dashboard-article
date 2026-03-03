// import { useState } from "react";
import MainLayout from "./MainLayout";
import { Dot, ChevronRight, Plus } from "lucide-react";
import WriteIcon from "../icons/WriteIcon";

const CreateNews = () => {
  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Sections */}
        <div className="flex bg-white rounded-lg shadow-sm items-center justify-between px-6 h-[68px]">
          <div className="flex justify-between w-auto gap-8">
            <div className="flex items-center text-sm">
              <WriteIcon className="w-5 h-5 fill-current text-[#3AAFA9] mr-4" />
              <span className="text-base font-semibold text-[#414853]">
                Write
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Dot className="w-12 h-12 text-primary" />
              <span className="font-normal text-sm text-[#414853]">Saved</span>
            </div>
          </div>

          <div className="flex items-center text-xs">
            <WriteIcon className="w-4 h-4 fill-current text-[#3AAFA9] mr-2" />
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Write</span>

            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Create News</span>
          </div>
        </div>

        {/* Form Sections CreateNews.jsx */}
        <div className="form-input bg-white rounded-lg shadow-sm px-4 md:px-10 py-8">
          <h1 className="text-2xl font-semibold text-[#414853] mb-8">
            Build New Company Project
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#414853] mb-1">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                />
              </div>

              {/* Location & Size */}
              <div className="flex flex-col md:flex-row md:gap-6 space-y-4 md:space-y-0">
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Location<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Size<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter size"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>
              </div>

              {/* Product & Placement */}
              <div className="flex flex-col md:flex-row md:gap-6 space-y-4 md:space-y-0">
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Product<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Placement<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter placement"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#414853] mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Start Writing..."
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm h-32 focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                ></textarea>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* Selected Tags */}
              <div>
                <label className="block text-sm font-medium text-[#414853] mb-1">
                  Selected Tags<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Add tags..."
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                />
              </div>

              {/* Suggested Tags */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Suggested Tags</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "LED Outdoor",
                    "LED Indoor",
                    "Digital Signage",
                    "Video Wall",
                    "Interactive Whiteboard",
                    "Mobile Videotron",
                    "LED Poster",
                    "Creative LED",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-[#E6F8F7] text-[#3AAFA9] rounded-md hover:bg-[#d5f2ef] transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-[#414853] mb-1">
                  Upload Image<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  You can upload a maximum of up to 3 images
                </p>
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  <div className="text-center">
                    <img
                      src="/icons/upload.svg"
                      alt="Upload"
                      className="mx-auto mb-2 w-auto h-16"
                    />
                    <p>
                      Drag and Drop file here or{" "}
                      <span className="text-[#3AAFA9] cursor-pointer">
                        choose file
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Support format: WEBM
                </p>
              </div>

              {/* Publish Button */}
              <div>
                <button
                  type="submit"
                  className="bg-[#C0C0C0] text-white text-sm font-medium px-6 py-2 rounded-md cursor-not-allowed w-full"
                  disabled
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateNews;
