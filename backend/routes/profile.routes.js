// profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate } = require('../controllers/auth.controller');

// POST /api/profile/analysis-report
router.post('/analysis-report', authenticate, profileController.addAnalysisReport);

// GET /api/profile/analysis-reports
router.get('/analysis-reports', authenticate, profileController.getAnalysisReports);

// DELETE /api/profile/analysis-report/:reportId
router.delete('/analysis-report/:reportId', authenticate, profileController.deleteAnalysisReport);

module.exports = router;
