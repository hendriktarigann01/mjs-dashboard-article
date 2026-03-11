import { MoreHorizontal, Cloud, CloudOff } from "lucide-react";
import { getFirstImage } from "../helpers/image-helper";

/**
 * Remove all HTML tags from a string
 * "<p>Teknologi LED...</p>" → "Teknologi LED..."
 */

const stripHtml = (html) =>
  html
    ?.replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim() ?? "";

/**
 * Props:
 * - item          : data artikel dari API
 * - imageKey      : "image_news" | "image_project"
 * - mode          : "draft" | "published"
 * - activeTab     : "news" | "project"
 * - openDropdownId / setOpenDropdownId
 * - actionLoading
 * - onPublish     : (id) => void   — hanya draft
 * - onUnpublish   : (id) => void   — hanya published
 * - onEdit        : (item) => void
 * - onDelete      : (id) => void
 */
const Card = ({
  item,
  imageKey,
  mode,
  openDropdownId,
  setOpenDropdownId,
  actionLoading,
  onPublish,
  onUnpublish,
  onEdit,
  onDelete,
}) => {
  const isOpen = openDropdownId === item._id;
  const isLoading = actionLoading === item._id;

  return (
    <div className="relative flex items-start space-x-4">
      {/* Thumbnail — ambil gambar pertama dari array */}
      <div className="w-[157px] h-[90px] bg-transparent rounded-lg flex-shrink-0 overflow-hidden">
        <img
          src={getFirstImage(item[imageKey])}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 leading-5">
          {item.title}
        </h4>
        {/* Strip HTML tags dari description */}
        <p className="text-xs md:text-sm text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
          {stripHtml(item.description)}
        </p>
        <p className="text-xs text-[#9E9E9E] mt-2">
          {new Date(item.updated_at || item.created_at).toLocaleDateString(
            "id-ID",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          )}
        </p>
      </div>

      {/* Dropdown */}
      <div className="relative dropdown-action flex-shrink-0">
        <button
          onClick={() => setOpenDropdownId(isOpen ? null : item._id)}
          className="p-1 text-gray-400 hover:text-gray-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#3AAFA9] rounded-full animate-spin" />
          ) : (
            <MoreHorizontal className="w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="absolute mt-2 right-0 w-44 md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {/* Draft actions */}
            {mode === "draft" && (
              <button
                onClick={() => onPublish(item._id)}
                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
              >
                <Cloud className="w-4 h-4 mr-3 text-[#3AAFA9]" />
                Publish
              </button>
            )}

            {/* Published actions */}
            {mode === "published" && (
              <button
                onClick={() => onUnpublish(item._id)}
                className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
              >
                <CloudOff className="w-4 h-4 mr-3 text-gray-500" />
                Unpublish
              </button>
            )}

            {/* Edit — shared */}
            <button
              onClick={() => onEdit(item)}
              className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
            >
              <img src="/icons/edit.svg" className="w-4 h-4 mr-3" alt="edit" />
              Edit
            </button>

            {/* Delete — shared */}
            <button
              onClick={() => onDelete(item._id)}
              className="flex items-center w-full px-4 py-2 text-xs md:text-sm text-red-500 hover:bg-red-50"
            >
              <img
                src="/icons/delete.svg"
                className="w-4 h-4 mr-3"
                alt="delete"
              />
              {mode === "draft" ? "Delete Draft" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
