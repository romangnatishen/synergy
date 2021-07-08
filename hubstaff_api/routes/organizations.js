const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {
    const response = await api.request('v2/organizations',{
        method: 'GET',
        json: true,
    });
    const body = JSON.parse(response.body);
    console.log(response);
    res.render('organizations', {
        title: 'Organization list',
        organizations: body.organizations || []
    });
});

module.exports = router;
