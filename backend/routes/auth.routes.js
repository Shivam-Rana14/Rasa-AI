const express = require('express');
const router = express.Router();
const { signup, signin, authenticate } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
