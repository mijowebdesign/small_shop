import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import landingRoutes from './routes/landingRoutes.js';
import { verifyToken, authorizeRoles } from './middleware/authMiddleware.js';
import passport from './config/passport.js'; // Import configured passport

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Crucial for sending cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // Initialize passport
// Routes
app.use('/api/landing', landingRoutes); 
app.use('/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Example of a protected route
app.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Ovo su vaši podaci', user: req.user });
});

// PRIMER: Ruta za izveštaje dostupna samo za admina i managera
app.get('/api/reports', verifyToken, authorizeRoles('admin', 'manager'), (req, res) => {
  res.json({ 
    message: 'Ovo je poverljiv izveštaj', 
    data: ['Report 1', 'Report 2', 'Report 3'] 
  });
});

// Globalni error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Nešto je pošlo po zlu na serveru!' });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
