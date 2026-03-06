// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedDocTypes = /pdf/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "image_url") {
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG images are allowed for property images"));
    }
  } else if (file.fieldname === "documents") {
    if (allowedDocTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF documents are allowed for ownership docs"));
    }
  } else {
    cb(new Error("Unknown field"));
  }
};

// Limits per file type
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for all files
  },
});

export default upload;