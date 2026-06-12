import express from 'express';
import { getCategories, getSubCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/sub/:parentId', getSubCategories);
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), createCategory);
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), updateCategory);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'manager'), deleteCategory);

export default router;
