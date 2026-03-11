import { useRef } from "react";

const MAX_FILES = 3;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/webm",
];
const ACCEPT_ATTR = "image/*,video/webm";

const XIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const FileRow = ({ name, onRemove }) => (
  <div className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2 bg-white">
    <div className="flex items-center gap-3 min-w-0">
      <img
        src="/icons/image-placeholder.svg"
        alt=""
        className="w-6 h-6 flex-shrink-0"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <span className="text-sm text-gray-600 truncate">{name}</span>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-red-400 hover:text-red-600 flex-shrink-0 ml-3"
    >
      <XIcon />
    </button>
  </div>
);

/**
 * ImageUploader — reusable untuk Create/Edit News & Project
 *
 * Props:
 * - files            : File[]    — state dari parent
 * - onChange         : (files: File[]) => void
 * - existingUrls     : string[]  — URL gambar existing (untuk edit), optional
 * - onRemoveExisting : (index: number) => void — optional
 */
const ImageUploader = ({
  files = [],
  onChange,
  existingUrls = [],
  onRemoveExisting,
}) => {
  const fileInputRef = useRef(null);
  const totalCount = existingUrls.length + files.length;
  const isFull = totalCount >= MAX_FILES;

  const handleFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) =>
      ACCEPTED_TYPES.includes(f.type),
    );
    const remaining = MAX_FILES - totalCount;
    const toAdd = valid.slice(0, remaining);
    if (toAdd.length > 0) onChange([...files, ...toAdd]);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isFull) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeNewFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isFull && fileInputRef.current?.click()}
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition
          ${
            isFull
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 cursor-pointer hover:border-[#3AAFA9]"
          }`}
      >
        <img
          src={isFull ? "/icons/upload-nonactive.svg" : "/icons/upload.svg"}
          alt="upload"
          className="w-12 h-12 mb-3"
        />
        {isFull ? (
          <p className="text-sm text-gray-400">
            Batas maksimal {MAX_FILES} file tercapai
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-400">
              Drag and Drop file here or{" "}
              <span className="text-[#3AAFA9]">choose file</span>
            </p>
            <p className="text-xs text-gray-300 mt-1">
              You can upload a maximum of up to {MAX_FILES} images
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Support format: JPG, PNG, WEBP, GIF, SVG, WEBM
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* File list — existing (edit mode) */}
      {existingUrls.map((url, i) => (
        <FileRow
          key={`existing-${i}`}
          name={url.split("/").pop().split("?")[0]}
          onRemove={() => onRemoveExisting?.(i)}
        />
      ))}

      {/* File list — new files */}
      {files.map((file, i) => (
        <FileRow
          key={`new-${i}`}
          name={file.name}
          onRemove={() => removeNewFile(i)}
        />
      ))}
    </div>
  );
};

export default ImageUploader;
