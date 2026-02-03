import multer from "multer";
import path from "path";
import fs from "fs";


export const createUploader = (folderName, maxFileSizeMB = 10) => {
  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
      const uniqueName = `${base}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Allowed: PNG, JPG, PDF, DOC, DOCX"));
    }
    cb(null, true);
  };

  const limits = { fileSize: maxFileSizeMB * 1024 * 1024 };

  const upload = multer({ storage, fileFilter, limits }).fields([
  { name: "file", maxCount: 1 }
]);

  return (req, res, next) => {
    req.maxFileSizeMB = maxFileSizeMB;
    upload(req, res, (err) => next(err));
  };
};
