const express = require('express');
const router = express.Router();
const { authenticate, addAnalysisReport, getAnalysisReports } = require('../controllers/profile.controller');

// Save a new analysis report for the authenticated user
router.post('/analysis-report', authenticate, addAnalysisReport);

// Get all analysis reports for the authenticated user
router.get('/analysis-reports', authenticate, getAnalysisReports);

module.exports = router;