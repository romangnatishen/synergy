const Model = require('../model');
redmineUser  = require('../../user/controllers/getCurrentUser');
const createKanbanComment = require('../../kanban_comment/controllers/createAtServer');

module.exports = async (req, res, next) => {

    let allowToDelete = true;

    const comment_data = {
        issue_id: req.body.issue_id,
        user_id: req.body.executor_id,
        user_name: req.body.executor_name,
        description: 'Usunięto z Kanban',
        // author: req.body.auditor_name,
        link: 'https://tasks.axioma.pl/issues/'+req.body.issue_id,
        linkMessage: 'Zadanie: ' + req.body.issue_id,
        message: 'zostało usunięte z Kanban dla '+req.body.executor_name,
        channel: '@U025G55AMT4',
    };

    if (allowToDelete === true) {
        const deleteFilter = {
            where: {
                issue_id: req.body.issue_id,
                executor_id: req.body.executor_id
            }
        };

        await Model.destroy(deleteFilter)
            .then(function (deletedRecord) {
                createKanbanComment(comment_data);                
                res.status(200).send(true);
            })
            .catch(function (error){
                res.status(400).send(false);
            });            
    }
}