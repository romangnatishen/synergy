const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {
    const response = await api.request('v2/users/707826',{
        method: 'GET',
        json: true,
    });
    const body = JSON.parse(response.body);
    // res.render('organizations', {
    //     title: 'Organization list',
    //     organizations: body.organizations || []
    // });
    console.log(body);
    res.status(200).send(body);

});

module.exports = router;
