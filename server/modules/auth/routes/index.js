const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.post('/auth', controllers.auth);

module.exports = router;