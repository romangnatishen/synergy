const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/events',verifyProfile, controllers.findAll);
router.get('/events_by_participants',verifyProfile, controllers.findAll);
router.get('/event/:id',verifyProfile, controllers.findById);
router.post('/event',verifyProfile, controllers.create);
router.put('/event/:id',verifyProfile, controllers.update);
router.delete('/event/:id',verifyProfile, controllers.remove);

module.exports = router;