const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/projects', controllers.findAll);
router.get('/project_members', controllers.projectMembers);

module.exports = router;