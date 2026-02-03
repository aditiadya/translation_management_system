import { createUploader } from "./multerConfig.js";

export const clientUpload = createUploader("client_documents", 5);
export const vendorUpload = createUploader("vendor_documents", 5);
export const projectInputUpload = createUploader("project_input_files", 10);