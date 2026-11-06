import { Router } from 'express';
import {
  createIDCard,
  getIDCards,
  getIDCardById,
  updateIDCard,
  deleteIDCard,
  verifyIDCardByCode,
} from '../controllers/idCardController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = Router();

// Public verification route for scanning QR codes
router.get('/verify/:code', verifyIDCardByCode);

// Main ID Card management routes
router.use(optionalAuthMiddleware);
router.post('/', createIDCard);
router.get('/', getIDCards);
router.get('/:id', getIDCardById);
router.put('/:id', updateIDCard);
router.delete('/:id', deleteIDCard);

export default router;
