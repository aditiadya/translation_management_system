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

  // CHANGE THIS: Use .single() instead of .fields()
  const upload = multer({ storage, fileFilter, limits }).single("file");

  return (req, res, next) => {
    req.maxFileSizeMB = maxFileSizeMB;
    upload(req, res, (err) => {
      if (err) {
        // Delete uploaded file if multer validation fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: `File too large. Maximum size: ${maxFileSizeMB}MB`,
            });
          }
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      next();
    });
  };
};


export const createImageUploader = (folderName, maxFileSizeMB = 5) => {
  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `profile-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PNG, JPG, JPEG, WEBP allowed."));
    }
    cb(null, true);
  };

  const limits = { fileSize: maxFileSizeMB * 1024 * 1024 };
  const upload = multer({ storage, fileFilter, limits }).single("file");

  return (req, res, next) => {
    req.maxFileSizeMB = maxFileSizeMB;
    upload(req, res, (err) => {
      if (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: `File too large. Max: ${maxFileSizeMB}MB` });
        }
        return res.status(400).json({ success: false, message: err.message || "Upload failed" });
      }
      next();
    });
  };
};