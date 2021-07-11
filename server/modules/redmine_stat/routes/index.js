const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/statistics',verifyProfile, controllers.findAll);
// router.get('/statistics_periods',verifyProfile, controllers.getPeriods);
// router.get('/statistics_projects',verifyProfile, controllers.getProjects);
// router.get('/statistics_statuses',verifyProfile, controllers.getProjectStatuses);
// router.get('/statistics_executors',verifyProfile, controllers.getProjectExecutors);

// router.get('/statistics_by_project',verifyProfile, controllers.generalByProject);
// router.get('/statistic/:id',verifyProfile, controllers.findById);
// router.post('/statistic',verifyProfile, controllers.create);
// router.put('/statistic/:id',verifyProfile, controllers.update);
// router.delete('/statistic/:id',verifyProfile, controllers.remove);

module.exports = router;