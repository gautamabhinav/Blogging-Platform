import express from 'express';
import { getTotals } from '../controllers/stats.controller.js';

const router = express.Router();

// GET /api/v1/stats/totals
router.get('/totals', getTotals);

export default router;
