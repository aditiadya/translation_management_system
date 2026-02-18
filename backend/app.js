import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import adminDetailsRoutes from "./routes/adminDetailsRoutes.js"
import AdminProfileRoutes from "./routes/adminProfileRoutes.js"

import adminServiceRoutes from './routes/adminServiceRoutes.js';
import adminLanguageRoutes from './routes/adminLanguageRoutes.js';
import adminSpecializationRoutes from "./routes/adminSpecializationRoutes.js";
import adminUnitsRoutes from "./routes/adminUnitsRoutes.js";
import adminCurrencyRoutes from "./routes/adminCurrencyRoutes.js";
import adminPaymentMethodRoutes from "./routes/adminPaymentMethodRoutes.js";

import languageRoutes from "./routes/languageRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";

import managerDetailsRoutes from "./routes/managerDetailsRoutes.js"
import managerRolesRoutes from "./routes/managerRolesRoutes.js";

import clientDetailsRoutes from "./routes/clientDetailsRoutes.js"
import clientPoolRoutes from "./routes/clientPoolRoutes.js"
import clientContactPersonRoutes from "./routes/clientContactPersonRoutes.js"
import clientDocumentsRoutes from "./routes/clientDocumentsRoutes.js"
import clientPriceListRoutes from "./routes/clientPriceListRoutes.js"

import vendorDetailsRoutes from "./routes/vendorDetailsRoutes.js"
import vendorContactPersonRoutes from "./routes/vendorContactPersonRoutes.js"
import vendorDocumentsRoutes from "./routes/vendorDocumentsRoutes.js"
import vendorServicesRoutes from "./routes/vendorServicesRoutes.js"
import vendorSpecializationsRoutes from "./routes/vendorSpecializationsRoutes.js"
import vendorLanguagePairsRoutes from "./routes/vendorLanguagePairsRoutes.js"
import vendorSettingRoutes from "./routes/vendorSettingRoutes.js"
import vendorPaymentMethodRoutes from "./routes/vendorPaymentMethodRoutes.js"
import vendorPriceListRoutes from "./routes/vendorPriceListRoutes.js"

import projectDetailsRoutes from "./routes/projectDetailsRoutes.js"
import projectStatusHistoryRoutes from "./routes/projectStatusHistoryRoutes.js"
import projectFileRoutes from "./routes/projectFileRoutes.js";
import projectFinancesRoutes from "./routes/projectFinances.js";

import jobRoutes from "./routes/jobRoutes.js";
import jobFileRoutes from "./routes/jobFileRoutes.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use('/api/auth', authRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/admin-details", adminDetailsRoutes);
app.use("/api/admin-profile", AdminProfileRoutes);

app.use('/api/admin-services', adminServiceRoutes);
app.use('/api/admin-language-pairs', adminLanguageRoutes);
app.use("/api/admin-specializations", adminSpecializationRoutes);
app.use("/api/admin-units", adminUnitsRoutes);
app.use("/api/admin-currencies", adminCurrencyRoutes);
app.use("/api/admin-payment-methods", adminPaymentMethodRoutes);

app.use("/api/languages", languageRoutes);
app.use("/api/currencies", currencyRoutes);

app.use("/api/managers", managerDetailsRoutes);
app.use("/api/manager-roles", managerRolesRoutes);

app.use("/api/clients", clientDetailsRoutes);
app.use("/api/client-pools", clientPoolRoutes);
app.use("/api/client/contact-persons", clientContactPersonRoutes);
app.use("/api/client-documents", clientDocumentsRoutes);
app.use("/api/client-price-list", clientPriceListRoutes);

app.use("/api/vendors", vendorDetailsRoutes);
app.use("/api/vendor/contact-persons", vendorContactPersonRoutes);
app.use("/api/vendor-documents", vendorDocumentsRoutes);
app.use("/api/vendor-services", vendorServicesRoutes);
app.use("/api/vendor-specializations", vendorSpecializationsRoutes);
app.use("/api/vendor-language-pairs", vendorLanguagePairsRoutes);
app.use("/api/vendor-settings", vendorSettingRoutes);
app.use("/api/vendor-payment-methods", vendorPaymentMethodRoutes);
app.use("/api/vendor-price-list", vendorPriceListRoutes);

app.use("/api/projects", projectDetailsRoutes);
app.use("/api/project-status-history", projectStatusHistoryRoutes);
app.use("/api", projectFileRoutes);
app.use("/api/project-finances", projectFinancesRoutes);


app.use("/api", jobRoutes);
app.use("/api", jobFileRoutes);

export default app;