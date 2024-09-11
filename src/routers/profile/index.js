'use strict'

const express = require('express');
const profileController = require('../../controllers/profile.controller');
const router = express.Router();

// admin
router.get('/viewAny', profileController.profiles);
router.get('/viewOwn', profileController.profile);

module.exports = router;
