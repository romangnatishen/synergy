const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/issue_users',verifyProfile, controllers.findAll);
router.get('/issues_by_user',verifyProfile, controllers.findByUser);
router.get('/issue_user/:id',verifyProfile, controllers.findById);
router.post('/issue_user',verifyProfile, controllers.create);
router.put('/issue_user/:id',verifyProfile, controllers.update);
router.post('/delete_issue_users',verifyProfile, controllers.remove);

module.exports = router;