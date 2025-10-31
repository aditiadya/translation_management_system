import { createUploader } from "./multerConfig.js";

export const clientUpload = createUploader("client_documents", 5);
export const vendorUpload = createUploader("vendor_documents", 5);