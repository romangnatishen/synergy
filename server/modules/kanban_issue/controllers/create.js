const Model = require('../model');
const createKanbanComment = require('../../kanban_comment/controllers/createAtServer');

module.exports = async (req, res) => {

    const data = {
        ...req.body        
    };
    if (req.body) {        
        const filter = { 
            where: {
                executor_id : req.body.executor_id,
                issue_id : req.body.issue_id    
                }
            };
        const kanbanIssueFound = await Model.findAll(filter);
        if (Object.keys(kanbanIssueFound).length === 0) {
            const kanbanNewIssue = await Model.create(data).catch((err) =>{
                res.status(400).send('Kanban issue is not created');
                });

            const comment_data = {
                issue_id: req.body.issue_id,
                user_id: req.body.executor_id,
                user_name: req.body.executor_name,
                description: 'Dodano do Kanban',
                author: req.body.auditor_name,
                link: 'https://tasks.axioma.pl/issues/'+req.body.issue_id,
                linkMessage: 'Zadanie: ' + req.body.issue_id,
                message: 'zostało dodane do Kanban dla '+req.body.executor_name,
                channel: '@U025G55AMT4',
            };

            const commentRes = await createKanbanComment(comment_data);

            res.status(200).send(kanbanNewIssue);            
        } else {
            res.status(200).send(kanbanIssueFound)
        }
    }
};