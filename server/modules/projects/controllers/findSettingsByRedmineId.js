const Model = require('../model');

module.exports = async (req, res, next) => {
    
    // console.log('req',req);
    const currenttProject = await Model.findOne({ where: { redmine_id: req.query.redmine_id } })
        .catch((err) => {
            res.status(200).send({message : err})
        })
    res.status(200).send(currenttProject);

}