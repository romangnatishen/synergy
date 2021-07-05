const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
router.post('/project_settings', controllers.create);
router.get('/project_settings', controllers.findSettingsByRedmineId);
router.get('/projects_redmine', controllers.findAllInRedmine);
router.get('/project_members', controllers.projectMembers);

module.exports = router;