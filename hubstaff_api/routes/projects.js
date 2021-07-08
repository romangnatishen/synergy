const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {
    const response = await api.request('v2/organizations/104299/projects',{
        method: 'GET',
        json: true
        // organization_id:104299
    });
    const body = JSON.parse(response.body);
    // console.log(body);
    res.status(200).send(body);
    // res.render('projects', {
    //     title: 'projects list',
    //     projects: body.projects || []
    // });
});

module.exports = router;
