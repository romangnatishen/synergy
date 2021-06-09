const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/issues', controllers.findAll);
router.put('/update_issue', controllers.updateIssue);
router.get('/get_issue_by_id', controllers.getIssue);

module.exports = router;