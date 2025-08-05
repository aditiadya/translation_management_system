import 'dotenv/config';   // auto loads .env
import app from './app.js';
import db from './models/index.js';
const { AdminAuth, AdminDetails } = db;
import { connectDB } from './config/db.js';
import { sequelize } from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Sync all models
  await sequelize.sync(); // In production, use migrations!
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});