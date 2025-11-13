import 'dotenv/config';  
import app from './app.js';
import { connectDB } from './config/db.js';
import { sequelize } from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await sequelize.sync(); 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});