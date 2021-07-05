const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {

    const reqParams = req.query;
    console.log('status params', reqParams);
    // const reqFilter = JSON.parse(req.query);
    const dateFrom = new Date(String(reqParams.date_from));
    const dateTo = new Date(String(reqParams.date_to));
    const filterProject = reqParams.project;
    const filterExecutor = reqParams.assigned_to;

    const reqFilter = {
        stat_date:{ 
            "$between":[dateFrom, dateTo]
        }, 
        project:filterProject,
        assigned_to:filterExecutor,
    };

    const statistics = await Model.findAll(
        { 
            attributes: ['stat_date','status', [sequelize.fn('count', sequelize.col('issue_id')),'issue_cnt']],
            where: reqFilter,
            order: [
                ['status', 'ASC'],
                ['stat_date', 'ASC'],
            ],            
            group: ['stat_date','status'],
        }).catch((err) =>{
            console.log(err);
            res.status(400).send('Statistic are not found');
        });

    res.status(200).send(statistics);
};