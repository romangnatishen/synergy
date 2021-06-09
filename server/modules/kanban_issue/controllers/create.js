const Model = require('../model');

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
            res.status(200).send(kanbanNewIssue);            
        } else {
            res.status(200).send(kanbanIssueFound)
        }
    }
};