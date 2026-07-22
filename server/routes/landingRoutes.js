import express from 'express';
import {  getLandingData } from '../controllers/landingContoller.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
debugger

router.get('/', getLandingData); // Ruta za landing stranicu


export default router;