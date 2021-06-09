const Model = require('../model');

module.exports = async (req, res, next) => {
    const currentIssueId = req.query.taskId;
    console.log(req);
    const filter = {where:{issue_id:currentIssueId}};
    const kanban_comments = await Model.findAll(filter);
    res.status(200).send(kanban_comments);
};