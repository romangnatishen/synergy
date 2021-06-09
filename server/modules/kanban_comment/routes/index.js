const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/kanban_comments',verifyProfile, controllers.findAll);
router.get('/kanban_comments/:id',verifyProfile, controllers.findById);
router.post('/kanban_comment',verifyProfile, controllers.create);
router.put('/kanban_comment/:id',verifyProfile, controllers.update);
router.delete('/kanban_comment/:id',verifyProfile, controllers.remove);

module.exports = router;