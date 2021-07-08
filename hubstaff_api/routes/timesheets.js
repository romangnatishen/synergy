const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {

    const response = await api.request('v2/organizations/104299/activities/daily?date[start]=2021.06.14&date[stop]=2021.06.14',{
    // const response = await api.request('v2/organizations/104299/activities?time_slot[start]=2021.06.14 06:05:00Z&time_slot[stop]=2021.06.14 13:05:00Z',{
    // const response = await api.request('v2/organizations/104299/timesheets?date[start]=2021.06.14&date[stop]=2021.06.20',{
        method: 'GET',
        json: true
    });
    const body = JSON.parse(response.body);
    // console.log(body);
    res.status(200).send(body);
    // res.render('timessheets', {
    //     title: 'projects list',
    //     projects: body.projects || []
    // });
});

module.exports = router;
