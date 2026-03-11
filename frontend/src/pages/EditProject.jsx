import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import SuccessModal from "../components/SuccessModal";
import { Dot, ChevronRight, X } from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import WriteIcon from "../icons/WriteIcon";
import api from "../lib/api";

const SUGGESTED_TAGS = [
  "LED Indoor",
  "LED Outdoor",
  "Video Wall",
  "Interactive Whiteboard",
  "Digital Signage",
];

const QUILL_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    size: "",
    product: "",
    placement: "",
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successItem, setSuccessItem] = useState(null);
  const [submittedStatus, setSubmittedStatus] = useState(null);

  const autosaveTimer = useRef(null);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const initialData = useRef(null);

  // Fetch existing data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/get-project/${id}`);
        const data = res.data;
        initialData.current = data;
        setForm({
          title: data.title,
          location: data.location,
          product: data.product,
          placement: data.placement,
          description: data.description,
          tags: data.tags || [],
        });
        setExistingImages(
          Array.isArray(data.image_project)
            ? data.image_project
            : data.image_project
              ? [data.image_project]
              : [],
        );
      } catch (err) {
        setError("Gagal memuat data project");
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id]);

  // Init Quill setelah data loaded
  useEffect(() => {
    if (fetching) return;
    if (quillInstance.current) return;
    if (!quillRef.current) return;

    quillInstance.current = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Start writing...",
      modules: { toolbar: QUILL_TOOLBAR },
    });

    if (initialData.current?.description) {
      quillInstance.current.root.innerHTML = initialData.current.description;
    }

    quillInstance.current.on("text-change", () => {
      const html = quillInstance.current.root.innerHTML;
      setForm((prev) => {
        const updated = { ...prev, description: html };
        triggerAutosave(updated);
        return updated;
      });
    });

    return () => clearTimeout(autosaveTimer.current);
  }, [fetching]);

  const triggerAutosave = useCallback((data) => {
    setSaveStatus("saving");
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await api.post("/autosave/project", data);
        setSaveStatus("saved");
      } catch (_) {
        setSaveStatus("error");
      }
    }, 2000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    triggerAutosave(updated);
  };

  const addTag = (tag) => {
    if (!tag.trim() || form.tags.includes(tag.trim())) return;
    const updated = { ...form, tags: [...form.tags, tag.trim()] };
    setForm(updated);
    triggerAutosave(updated);
    setTagInput("");
  };

  const removeTag = (tag) => {
    const updated = { ...form, tags: form.tags.filter((t) => t !== tag) };
    setForm(updated);
    triggerAutosave(updated);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const descriptionText = form.description.replace(/<[^>]*>/g, "").trim();
  const isFormValid =
    form.title &&
    form.location &&
    form.product &&
    form.placement &&
    descriptionText;

  const handleSubmit = async (status) => {
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("product", form.product);
      formData.append("placement", form.placement);
      formData.append("description", form.description);
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("status", status);
      imageFiles.forEach((file) => formData.append("image_project", file));
      if (existingImages.length > 0)
        formData.append("existing_images", JSON.stringify(existingImages));

      await api.put(`/projects/update-project/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await api.delete("/autosave/project");
      // Capture image URL before any state reset
      let capturedImageUrl = null;
      if (imageFiles.length > 0) {
        capturedImageUrl = URL.createObjectURL(imageFiles[0]);
      } else if (existingImages && existingImages.length > 0) {
        capturedImageUrl = existingImages[0];
      }
      setSuccessItem({
        title: form.title,
        description: form.description,
        imageUrl: capturedImageUrl,
      });
      setSubmittedStatus(status);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menyimpan project");
    } finally {
      setLoading(false);
    }
  };

  const saveStatusLabel = {
    idle: { text: "", color: "text-gray-400" },
    saving: { text: "Saving...", color: "text-yellow-400" },
    saved: { text: "Saved", color: "text-[#3AAFA9]" },
    error: { text: "Save failed", color: "text-red-400" },
  };

  if (success) {
    const isDraft = submittedStatus === "draft";
    return (
      <MainLayout showNavbar={true} showSearch={true}>
        <SuccessModal
          title={
            isDraft
              ? "Draft Project Saved Successfully"
              : "Publish Project Successful"
          }
          subtitle={
            isDraft
              ? "Your content has been saved as a draft. You can continue editing it anytime."
              : undefined
          }
          item={successItem}
          primaryLabel={isDraft ? "Continue Writing" : "View Page"}
          onPrimary={() => (isDraft ? navigate(-1) : navigate("/published"))}
          secondaryLabel="Back to Dashboard"
          onSecondary={() => navigate("/")}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={true} showSearch={true}>
      <div className="space-y-6 min-h-screen">
        {/* Title Bar */}
        <div className="flex bg-white rounded-lg shadow-sm items-center justify-between px-6 h-[68px]">
          <div className="flex justify-between w-auto gap-8">
            <div className="flex items-center text-sm">
              <WriteIcon className="w-5 h-5 fill-current text-[#3AAFA9] mr-4" />
              <span className="text-base font-semibold text-[#414853]">
                Write
              </span>
            </div>
            {saveStatus !== "idle" && (
              <div className="flex items-center text-sm">
                <Dot
                  className={`w-12 h-12 ${saveStatusLabel[saveStatus].color}`}
                />
                <span
                  className={`font-normal text-sm ${saveStatusLabel[saveStatus].color}`}
                >
                  {saveStatusLabel[saveStatus].text}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center text-xs">
            <WriteIcon className="w-4 h-4 fill-current text-[#3AAFA9] mr-2" />
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Write</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Edit Project</span>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {fetching ? (
          <div className="bg-white rounded-lg shadow-sm px-4 md:px-10 py-8 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm px-4 md:px-10 py-8">
            <h1 className="text-2xl font-semibold text-[#414853] mb-8">
              Edit Project
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter title"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:gap-6 space-y-4 md:space-y-0">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-[#414853] mb-1">
                      Location<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter location"
                      className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-[#414853] mb-1">
                      Product<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter product"
                      className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Placement<span className="text-red-500">*</span>
                  </label>
                  <input
                    name="placement"
                    value={form.placement}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter placement"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3AAFA9]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <div
                    ref={quillRef}
                    className="border border-gray-300 rounded"
                    style={{ minHeight: "200px" }}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Tags
                  </label>
                  <div className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus-within:ring-1 focus-within:ring-[#3AAFA9] flex flex-wrap gap-2 items-center min-h-[42px]">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 bg-[#3AAFA9] text-white px-3 py-1 rounded text-xs"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Select one or more tags below"
                      className="flex-1 min-w-[120px] outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Suggested Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className={`text-xs px-2 py-1 rounded-md transition ${form.tags.includes(tag) ? "bg-[#3AAFA9] text-white" : "bg-[#E6F8F7] text-[#3AAFA9] hover:bg-[#d5f2ef]"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#414853] mb-1">
                    Upload Image
                  </label>
                  <ImageUploader
                    files={imageFiles}
                    onChange={setImageFiles}
                    existingUrls={existingImages}
                    onRemoveExisting={(i) =>
                      setExistingImages((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium px-6 py-2 rounded-md hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    disabled={!isFormValid || loading}
                    className="flex-1 border border-[#3AAFA9] text-[#3AAFA9] text-sm font-medium px-6 py-2 rounded-md hover:bg-[#E6F8F7] transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit("published")}
                    disabled={!isFormValid || loading}
                    className="flex-1 bg-[#3AAFA9] text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EditProject;
