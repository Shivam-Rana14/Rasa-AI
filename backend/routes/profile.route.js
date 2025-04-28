const express = require('express');
const router = express.Router();
const { authenticate, addAnalysisReport, getAnalysisReports, deleteAnalysisReport } = require('../controllers/profile.controller');

// Save a new analysis report for the authenticated user
router.post('/analysis-report', authenticate, addAnalysisReport);

// Get all analysis reports for the authenticated user
router.get('/analysis-reports', authenticate, getAnalysisReports);

// Delete an analysis report for the authenticated user by date
router.delete('/analysis-report/:date', authenticate, deleteAnalysisReport);

module.exports = router;