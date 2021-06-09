const Model = require('../model');
// const ModificationModel = require('../../modificationHistory/model');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
 
    const updateFilter = JSON.parse(req.body.updateFilter);
    const updateContent = JSON.parse(req.body.updateContent);

    const Found_issue = await Model.findOne(updateFilter);        
    const updateRes = await Found_issue.update(updateContent).catch((err) =>{
        console.log(err);
        res.status(400).send('User is not created');
    });

    res.status(200).send(updateRes);

}