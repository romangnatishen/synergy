const Model = require('../model');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {

    const updateFilter = JSON.parse(req.body.updateFilter);
    const updateContent = JSON.parse(req.body.updateContent);

    const Found_issues = await Model.findAll(updateFilter);        
    for await (let issue of Found_issues) {
        await issue.update(updateContent).catch((err) =>{
            console.log(err);
            res.status(400).send('Kanban issue is not updated');
        });        
    }
    res.status(200).send(true);
}