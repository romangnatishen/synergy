const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
router.post('/crm_lead', controllers.create);

module.exports = router;