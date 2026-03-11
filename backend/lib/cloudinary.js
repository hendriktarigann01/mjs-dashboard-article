const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer pakai memoryStorage 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP."));
    }
  },
});

// Upload buffer ke Cloudinary via stream
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 630, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadNewsImage = upload.array("image_news", 3);
const uploadProjectImage = upload.array("image_project", 3);

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadNewsImage,
  uploadProjectImage,
};
