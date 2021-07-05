const Model = require('../model');
const createKanbanComment = require('../../kanban_comment/controllers/createAtServer');

module.exports = async (req, res, next) => {

    const updateFilter = JSON.parse(req.body.updateFilter);
    const updateContent = JSON.parse(req.body.updateContent);


    const Found_issues = await Model.findAll(updateFilter);        
    for await (let issue of Found_issues) {
        await issue.update(updateContent).catch((err) =>{
            console.log(err);
            res.status(400).send('Kanban issue is not updated');
        });
        const comment_data = {
            issue_id: issue.issue_id,
            user_id: issue.executor_id,
            user_name: issue.executor_name,
            description: 'Aktualizacja zadania',
            author: '',
            link: 'https://tasks.axioma.pl/issues/'+issue.issue_id,
            linkMessage: 'Zadanie: ' + issue.issue_id,
            message: 'zostało zaktualizowane w Kanbanie '+issue.executor_name,
            channel: '@U025G55AMT4',
        };
        createKanbanComment(comment_data);                

    }   
    res.status(200).send(true);
}