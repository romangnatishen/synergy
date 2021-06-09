const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/event_participants',verifyProfile, controllers.findAll);
router.get('/event_participant/:id',verifyProfile, controllers.findById);
router.post('/event_participant',verifyProfile, controllers.create);
router.put('/event_participant/:id',verifyProfile, controllers.update);
router.delete('/event_participant/:id',verifyProfile, controllers.remove);

module.exports = router;