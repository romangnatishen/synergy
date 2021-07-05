const Model = require('../model');

module.exports = async (req, res, next) => {

    const currentIssueId = req.query.taskId;
    const filter = {where:{issue_id:currentIssueId}};
    const issue_users = await Model.findAll(filter);
    res.status(200).send(issue_users);

};