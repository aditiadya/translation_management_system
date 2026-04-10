import express from "express";
import { getVendorJobs, getVendorJobById, acceptOffer, rejectOffer, completeJob, uploadVendorOutputFile, downloadVendorInputFilesAsZip, downloadVendorOutputFilesAsZip } from "../controllers/vendor/vendorJobs.js";
import { jobOutputUpload } from "../middlewares/multerUploads.js";

const router = express.Router();

router.get("/", getVendorJobs);
router.get("/:id", getVendorJobById);
router.get("/:id/download-input-zip", downloadVendorInputFilesAsZip);
router.get("/:id/download-output-zip", downloadVendorOutputFilesAsZip);
router.post("/:id/accept", acceptOffer);
router.post("/:id/reject", rejectOffer);
router.post("/:id/complete", completeJob);
router.post("/:id/upload-output", jobOutputUpload, uploadVendorOutputFile);

export default router;
