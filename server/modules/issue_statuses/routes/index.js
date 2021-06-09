const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/issue_statuses', controllers.findAll);

module.exports = router;