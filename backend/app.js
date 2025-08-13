import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import adminServiceRoutes from './routes/adminServiceRoutes.js';
import adminLanguageRoutes from './routes/adminLanguageRoutes.js';



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

export default app;
