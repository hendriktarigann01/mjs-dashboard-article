import { useState, useEffect, useCallback, useRef } from "react";
import MainLayout from "./MainLayout";
import SuccessModal from "../components/SuccessModal";
import { Dot, ChevronRight } from "lucide-react";
import ImageUploader from "../components/ImageUploader";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import WriteIcon from "../icons/WriteIcon";
import api from "../lib/api";

const AUTOSAVE_DELAY = 2000;

const QUILL_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

const initialForm = { title: "", description: "" };

const CreateNews = () => {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saving" | "saved" | "error"
  const [loading, setLoading] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successItem, setSuccessItem] = useState(null);

  const autosaveTimer = useRef(null);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const formRef = useRef(form); // ref untuk akses form terbaru di closure

  // Sync formRef setiap form berubah
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // Load autosave dari Redis, simpan ke ref dulu
  const autosaveData = useRef(null);

  useEffect(() => {
    const loadAutosave = async () => {
      try {
        const res = await api.get("/autosave/news");
        if (res.data.data) {
          autosaveData.current = res.data.data;
          setForm(res.data.data);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (_) {
        //
      } finally {
        setLoadingDraft(false);
      }
    };
    loadAutosave();
  }, []);

  
  useEffect(() => {
    if (loadingDraft) return; 
    if (quillInstance.current) return; 
    if (!quillRef.current) return;

    quillInstance.current = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Start writing...",
      modules: { toolbar: QUILL_TOOLBAR },
    });

    // Set autosave content jika ada
    if (autosaveData.current?.description) {
      quillInstance.current.root.innerHTML = autosaveData.current.description;
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
  }, [loadingDraft]);

  const triggerAutosave = useCallback((data) => {
    setSaveStatus("saving");
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await api.post("/autosave/news", data);
        setSaveStatus("saved");
      // eslint-disable-next-line no-unused-vars
      } catch (_) {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    triggerAutosave(updated);
  };

  const descriptionText = form.description.replace(/<[^>]*>/g, "").trim();
  const isFormValid = form.title && descriptionText;

  const handleSubmit = async (status) => {
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("status", status);
      imageFiles.forEach((file) => formData.append("image_news", file));

      await api.post("/news/create-news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Hapus autosave dari Redis setelah berhasil submit
      await api.delete("/autosave/news");

      if (quillInstance.current) quillInstance.current.root.innerHTML = "";
      // Capture image URL before any state reset
      let capturedImageUrl = null;
      if (imageFiles.length > 0) {
        capturedImageUrl = URL.createObjectURL(imageFiles[0]);
      }
      setSuccessItem({
        title: form.title,
        description: form.description,
        imageUrl: capturedImageUrl,
      });
      setSuccess(true);
      setForm(initialForm);
      setImageFiles([]);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menyimpan news");
    } finally {
      setLoading(false);
    }
  };

  const saveStatusLabel = {
    saving: { text: "Saving...", color: "text-yellow-400" },
    saved: { text: "Saved", color: "text-[#3AAFA9]" },
    error: { text: "Save failed", color: "text-red-400" },
  };

  if (success) {
    return (
      <MainLayout showNavbar={true} showSearch={true}>
        <SuccessModal
          title="Draft News Successfully"
          subtitle="Your content has been saved as a draft. You can continue editing it anytime."
          item={successItem}
          primaryLabel="Continue Writing"
          onPrimary={() => setSuccess(false)}
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
          </div>
          <div className="flex items-center text-xs">
            <WriteIcon className="w-4 h-4 fill-current text-[#3AAFA9] mr-2" />
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Write</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#414853]">Create News</span>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Skeleton saat load autosave */}
        {loadingDraft ? (
          <div className="bg-white rounded-lg shadow-sm px-4 md:px-10 py-8 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
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
              Create News
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
                    Upload Image<span className="text-red-500">*</span>
                  </label>
                  <ImageUploader files={imageFiles} onChange={setImageFiles} />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    disabled={!isFormValid || loading}
                    className="flex-1 border border-[#3AAFA9] text-[#3AAFA9] text-sm font-medium px-6 py-2 rounded-md hover:bg-[#E6F8F7] transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Menyimpan..." : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit("published")}
                    disabled={!isFormValid || loading}
                    className="flex-1 bg-[#3AAFA9] text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? "Menyimpan..." : "Publish"}
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

export default CreateNews;
