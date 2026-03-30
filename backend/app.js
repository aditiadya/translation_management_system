import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authenticateToken } from './middlewares/authMiddleware.js';
import { requireRole, ADMIN, ADMIN_AND_MANAGERS, VENDOR, requireSetupCompleted } from './middlewares/requireRole.js';

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
import vendorSelfDetailsRoutes from "./routes/vendorSelfDetailsRoutes.js"
import vendorContactPersonRoutes from "./routes/vendorContactPersonRoutes.js"
import vendorDocumentsRoutes from "./routes/vendorDocumentsRoutes.js"
import vendorServicesRoutes from "./routes/vendorServicesRoutes.js"
import vendorSpecializationsRoutes from "./routes/vendorSpecializationsRoutes.js"
import vendorLanguagePairsRoutes from "./routes/vendorLanguagePairsRoutes.js"
import vendorSettingRoutes from "./routes/vendorSettingRoutes.js"
import vendorProfileRoutes from "./routes/vendorProfileRoutes.js"
import vendorPaymentMethodRoutes from "./routes/vendorPaymentMethodRoutes.js"
import vendorPriceListRoutes from "./routes/vendorPriceListRoutes.js"

import projectDetailsRoutes from "./routes/projectDetailsRoutes.js"
import projectStatusHistoryRoutes from "./routes/projectStatusHistoryRoutes.js"
import projectFileRoutes from "./routes/projectFileRoutes.js";
import projectFinancesRoutes from "./routes/projectFinances.js";

import jobRoutes from "./routes/jobRoutes.js";
import jobFileRoutes from "./routes/jobFileRoutes.js";

import vendorAuthRoutes from "./routes/vendorAuthRoutes.js";

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
app.use("/api/admin-details", authenticateToken, requireRole(...ADMIN), requireSetupCompleted, adminDetailsRoutes);
app.use("/api/admin-profile", authenticateToken, requireRole(...ADMIN), requireSetupCompleted, AdminProfileRoutes);
app.use("/uploads", express.static("uploads"));

app.use('/api/admin-services', authenticateToken, requireRole(...ADMIN), adminServiceRoutes);
app.use('/api/admin-language-pairs', authenticateToken, requireRole(...ADMIN), adminLanguageRoutes);
app.use("/api/admin-specializations", authenticateToken, requireRole(...ADMIN), adminSpecializationRoutes);
app.use("/api/admin-units", authenticateToken, requireRole(...ADMIN), adminUnitsRoutes);
app.use("/api/admin-currencies", authenticateToken, requireRole(...ADMIN), adminCurrencyRoutes);
app.use("/api/admin-payment-methods", authenticateToken, requireRole(...ADMIN), adminPaymentMethodRoutes);

app.use("/api/languages", languageRoutes);
app.use("/api/currencies", currencyRoutes);

app.use("/api/managers", authenticateToken, requireRole(...ADMIN), requireSetupCompleted, managerDetailsRoutes);
app.use("/api/manager-roles", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, managerRolesRoutes);

app.use("/api/clients", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, clientDetailsRoutes);
app.use("/api/client-pools", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, clientPoolRoutes);
app.use("/api/client/contact-persons", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, clientContactPersonRoutes);
app.use("/api/client-documents", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, clientDocumentsRoutes);
app.use("/api/client-price-list", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, clientPriceListRoutes);

app.use("/api/vendors", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorDetailsRoutes);
app.use("/api/vendor/contact-persons", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorContactPersonRoutes);
app.use("/api/vendor-documents", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorDocumentsRoutes);
app.use("/api/vendor-services", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorServicesRoutes);
app.use("/api/vendor-specializations", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorSpecializationsRoutes);
app.use("/api/vendor-language-pairs", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorLanguagePairsRoutes);
app.use("/api/vendor-settings", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorSettingRoutes);
app.use("/api/vendor-profile", authenticateToken, requireRole(...VENDOR), vendorProfileRoutes); // Vendor portal only
app.use("/api/vendor-self", authenticateToken, requireRole(...VENDOR), vendorSelfDetailsRoutes); // Vendor portal only self details
app.use("/api/vendor-payment-methods", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorPaymentMethodRoutes);
app.use("/api/vendor-price-list", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, vendorPriceListRoutes);

app.use("/api/projects", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, projectDetailsRoutes);
app.use("/api/project-status-history", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, projectStatusHistoryRoutes);
app.use("/api", projectFileRoutes);
app.use("/api/project-finances", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), requireSetupCompleted, projectFinancesRoutes);


app.use("/api", jobRoutes);
app.use("/api", jobFileRoutes);

app.use("/api/vendor", vendorAuthRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors?.map((e) => e.message),
    });
  }
  
  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors?.[0]?.path || "value";
    return res.status(409).json({
      error: `${field} already exists`,
    });
  }
  
  // Sequelize foreign key errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      error: "Invalid reference ID",
    });
  }
  
  // Default error response
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  
  res.status(status).json({
    error: message,
  });
});

export default app;