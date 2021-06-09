const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/users',verifyProfile, controllers.findAll);
router.get('/redmine_users',verifyProfile, controllers.findRedmineUsers);
router.get('/users/:id',verifyProfile, controllers.findById);
router.post('/users',verifyProfile, controllers.create);
router.put('/users/:id',verifyProfile, controllers.update);
router.delete('/users/:id',verifyProfile, controllers.remove);
router.get('/profile', verifyProfile, controllers.profile);

module.exports = router;