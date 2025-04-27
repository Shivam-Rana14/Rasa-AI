const express = require('express');
const router = express.Router();
const { signup, signin, authenticate, addAnalysisReport, getAnalysisReports } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/signin', signin);

// Save a new analysis report for the authenticated user
router.post('/analysis-report', authenticate, addAnalysisReport);

// Get all analysis reports for the authenticated user
router.get('/analysis-reports', authenticate, getAnalysisReports);

module.exports = router;
