import express from 'express';
import { getTotals } from '../controllers/stats.controller.js';
import { userLimiter } from '../middlewares/ratelimiter.middleware.js';

const router = express.Router();

// GET /api/v1/stats/totals
router.get('/totals', userLimiter, getTotals);

export default router;
