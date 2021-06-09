const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
// const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/kanban_issues', controllers.findAll);
router.get('/kanban_issues_by_project', controllers.findByProject);
router.post('/delete_from_kanban', controllers.delete);
router.post('/update_kanban', controllers.update);
router.post('/add_to_kanban', controllers.addToKanban);

module.exports = router;