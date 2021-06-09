const Model = require('../model');

module.exports = async (req, res, next) => {
    const kanban_issues = await Model.findAll();
    res.status(200).send(kanban_issues);
};