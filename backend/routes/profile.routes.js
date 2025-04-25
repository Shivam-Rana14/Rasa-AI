const express = require('express');
const router = express.Router();
const { getProfile, addAnalysisReport, updateProfile } = require('../controllers/profile.controller');

// Get profile and reports for a user
router.get('/:userId', getProfile);
// Add analysis report for a user
router.post('/:userId/report', addAnalysisReport);
// Update profile details for a user
router.put('/:userId', updateProfile);

module.exports = router;
