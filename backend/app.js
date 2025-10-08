import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import adminServiceRoutes from './routes/adminServiceRoutes.js';
import adminLanguageRoutes from './routes/adminLanguageRoutes.js';
import adminSpecializationRoutes from "./routes/adminSpecializationRoutes.js";
import adminUnitsRoutes from "./routes/adminUnitsRoutes.js";
import adminCurrencyRoutes from "./routes/adminCurrencyRoutes.js";
import adminPaymentMethodRoutes from "./routes/adminPaymentMethodRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import adminDetailsRoutes from "./routes/adminDetailsRoutes.js"
import AdminProfileRoutes from "./routes/adminProfileRoutes.js"
import managerDetailsRoutes from "./routes/managerDetailsRoutes.js"
import clientDetailsRoutes from "./routes/clientDetailsRoutes.js"
import clientPoolRoutes from "./routes/clientPoolRoutes.js"

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

app.use('/api/auth', authRoutes);
app.use('/api/admin-services', adminServiceRoutes);
app.use('/api/admin-language-pairs', adminLanguageRoutes);
app.use("/api/admin-specializations", adminSpecializationRoutes);
app.use("/api/admin-units", adminUnitsRoutes);
app.use("/api/admin-currencies", adminCurrencyRoutes);
app.use("/api/admin-payment-methods", adminPaymentMethodRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/admin-details", adminDetailsRoutes);
app.use("/api/admin-profile", AdminProfileRoutes);
app.use("/api/managers", managerDetailsRoutes);
app.use("/api/clients", clientDetailsRoutes);
app.use("/api/client-pools", clientPoolRoutes);


export default app;
