const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
// const verifyProfile = require('../../../middleware/verifyProfile');

router.get('/kanban_statistics', controllers.findAll);
router.get('/statistic_projects', controllers.statisticProjects);
router.get('/statistic_statuses', controllers.statisticStatuses);
router.get('/statistic_periods', controllers.statisticsPeriods);
router.get('/statistics_by_projects', controllers.statisticsByProjects);
router.get('/statistics_by_statuses', controllers.statisticsByProjectStatuses);
router.get('/statistics_by_executors', controllers.statisticsProjectExecutors);

module.exports = router;