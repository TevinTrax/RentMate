import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folders exist
const imagesDir = "uploads/Images";
const docsDir = "uploads/Documents";

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image_url") {
      cb(null, imagesDir);
    } else if (file.fieldname === "documents") {
      cb(null, docsDir);
    } else {
      cb(new Error("Unknown field"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedDocTypes = /pdf/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "image_url") {
    if (allowedImageTypes.test(ext)) cb(null, true);
    else cb(new Error("Only JPG, JPEG, PNG images are allowed"));
  } else if (file.fieldname === "documents") {
    if (allowedDocTypes.test(ext)) cb(null, true);
    else cb(new Error("Only PDF documents are allowed"));
  } else {
    cb(new Error("Unknown field"));
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export default upload;