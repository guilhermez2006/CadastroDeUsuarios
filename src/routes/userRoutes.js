import { Router } from 'express';
import { authMiddleware } from '../Middlewares/auth.js';
import { login as loginUser } from '../controllers/authController.js';
import { createUser, getUsers, deleteUser, updateUser } from '../controllers/userController.js';

const router = Router();

// Rota de cadastro (pública)
router.post('/usuarios', createUser);

// Rota de login (pública)
router.post('/login', loginUser);

// Rotas protegidas (precisam de token)
router.get('/usuarios', authMiddleware, getUsers);
router.put('/usuarios/:id', authMiddleware, updateUser);
router.delete('/usuarios/:id', authMiddleware, deleteUser);

export default router;