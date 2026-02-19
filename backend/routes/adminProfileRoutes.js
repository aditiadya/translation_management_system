import express from "express";
import {
  getAdminProfile,
  addAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
  uploadProfileImage,
  viewProfileImage,
  getProfileImageMeta,
  deleteProfileImage,
} from "../controllers/admin/adminProfile.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createAdminProfileSchema,
  updateAdminProfileSchema,
} from "../validators/adminProfile.schema.js";
import { profileImageUpload } from "../middlewares/multerUploads.js";

const router = express.Router();
router.use(authenticateToken);

// Profile CRUD
router.get("/", getAdminProfile);
router.post("/", validate(createAdminProfileSchema), addAdminProfile);
router.put("/", validate(updateAdminProfileSchema), updateAdminProfile);
router.delete("/", deleteAdminProfile);

// Profile image
router.post("/image", profileImageUpload, uploadProfileImage);  // upload / change
router.get("/image", viewProfileImage);                         // streams the file
router.get("/image/meta", getProfileImageMeta);                 // JSON metadata + URL
router.delete("/image", deleteProfileImage);                    // delete

export default router;