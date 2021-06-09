const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/time_entries', controllers.findAll);

module.exports = router;