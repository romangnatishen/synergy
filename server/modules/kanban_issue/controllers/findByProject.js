const Model = require('../model');
const redmineTasks = require('../../issues/controllers');

module.exports = async (req, res, next) => {

    let filter = JSON.parse(JSON.stringify(req.query));    
    filter = {
        where: JSON.parse(filter.where)
    }; 
    const kanban_issues = await Model.findAll(filter);

    res.status(200).send(kanban_issues);
};