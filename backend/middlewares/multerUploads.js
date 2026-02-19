import { createUploader, createImageUploader } from "./multerConfig.js";

// Client & Vendor uploads (existing)
export const clientUpload = createUploader("client_documents", 10);
export const vendorUpload = createUploader("vendor_documents", 10);

// Project file uploads
export const projectInputUpload = createUploader("project_input_files", 150);
export const projectOutputUpload = createUploader("project_output_files", 150);

// Job file uploads
export const jobInputUpload = createUploader("job_input_files", 150);
export const jobOutputUpload = createUploader("job_output_files", 150);

// Profile image uploads
export const profileImageUpload = createImageUploader("profile_images", 5);