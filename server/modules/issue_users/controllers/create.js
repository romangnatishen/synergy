const Model = require('../model');
const createKanbanComment = require('../../kanban_comment/controllers/createAtServer');

module.exports = async (req, res) => {
  
    const data = {
        ...req.body        
    };

    const comment_data = {
        issue_id: req.body.issue_id,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        description: 'Dodano do zadania',
        author: '',
        link: 'https://tasks.axioma.pl/issues/'+req.body.issue_id,
        linkMessage: 'Zadanie: ' + req.body.issue_id,
        message: 'Użytkownik '+req.body.user_name+' został dodany do zadania',
        channel: '@U025G55AMT4',
    };

    const commentRes = await createKanbanComment(comment_data);

    const issue_user = await Model.create(data).catch((err) =>{
        console.log(err);
        res.status(400).send('User is not created');
        });

    res.status(200).send(issue_user);

};