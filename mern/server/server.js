import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import reservationsRoutes from './routes/reservations.js';
import bedsRoutes from './routes/beds.js';
import availabilityRoutes from './routes/availability.js';
import usersRoutes from './routes/users.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/beds', bedsRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/users', usersRoutes);


// Error handling middleware
app.use(errorHandler);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));