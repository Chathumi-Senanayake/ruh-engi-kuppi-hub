import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import moduleRoutes from './routes/module.routes';
import resourceRoutes from './routes/resource.routes';
import searchRoutes from './routes/search.routes';
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';
import path from 'path';

const PORT = process.env.PORT || 5000;

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RUHEngiKuppiHub API is running' });
});

// Temporary Database Seeding Route
app.get('/api/seed-database', (req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('node dist/seeder.js');
    res.status(200).json({ message: 'Database successfully seeded! You can now log in with admin / admin1234.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed database', error: String(error) });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ruhengikuppihub';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
