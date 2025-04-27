// profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth');

// POST /api/profile/analysis-report
router.post('/analysis-report', authMiddleware, profileController.addAnalysisReport);

// GET /api/profile/analysis-reports
router.get('/analysis-reports', authMiddleware, profileController.getAnalysisReports);

// DELETE /api/profile/analysis-report/:reportId
router.delete('/analysis-report/:reportId', authMiddleware, profileController.deleteAnalysisReport);

module.exports = router;
