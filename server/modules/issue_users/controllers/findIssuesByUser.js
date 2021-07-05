const Model = require('../model');

module.exports = async (req, res, next) => {

    const currentUserId = req.query.user_id;
    const currentUserType = req.query.user_type;

    const filter = {
        where: {
            user_id: currentUserId,
            user_type: currentUserType
        }
    };

    const issue_users = await Model.findAll(filter);
    res.status(200).send(issue_users);

};