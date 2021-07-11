const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {

    const reqParams = req.query;
    // console.log('status params', reqParams);
    // const reqFilter = JSON.parse(req.query);
    const dateFrom = new Date(String(reqParams.date_from));
    const dateTo = new Date(String(reqParams.date_to));
    const filterProject = reqParams.project_id;
    const filterExecutor = reqParams.executor_id;

    const reqFilter = {
        stat_date:{ 
            "$between":[dateFrom, dateTo]
        }, 
        project_id:filterProject,
        executor_id:filterExecutor,
    };

    const statistics = await Model.findAll(
        { 
            attributes: ['stat_date','kanban_status_id', [sequelize.fn('count', sequelize.col('issue_id')),'issue_cnt']],
            where: reqFilter,
            order: [
                ['kanban_status_id', 'ASC'],
                ['stat_date', 'ASC'],
            ],            
            group: ['stat_date','kanban_status_id'],
        }).catch((err) =>{
            console.log(err);
            res.status(400).send('Statistic are not found');
        });

    res.status(200).send(statistics);
};