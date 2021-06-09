const Model = require('../model');

module.exports = async (req, res, next) => {
    const filter = JSON.parse(req.query.filter || '{}');
    filter.where = {};
    if (req.profile) {
        if (req.profile.client_id) {
            filter.where.client_id = req.profile.client_id;
            if (req.profile.role===4) {
                filter.where.id = req.profile.id;
            }
        }
        const users = await Model.findAll(filter);
        res.status(200).send(users);
    }  else {
        res.status(400).send({
            message: 'bad request'            
        })
    }
};