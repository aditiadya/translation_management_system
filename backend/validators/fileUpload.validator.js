export const validateFileUpload = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    const maxSizeMB = req.maxFileSizeMB || 10;
    return res.status(400).json({
      success: false,
      message: `File too large. Maximum allowed size is ${maxSizeMB} MB.`,
    });
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Error && err.message) {
    return res.status(400).json({
      success: false,
      message: "File upload failed",
      details: [err.message],
    });
  }

  next(err);
};