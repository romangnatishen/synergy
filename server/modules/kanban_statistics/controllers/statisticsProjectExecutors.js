const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    console.log(req.query);
    const reqParams = req.query;
    if (reqParams) {
        const dateFrom = new Date(String(reqParams.date_from));
        const dateTo = new Date(String(reqParams.date_to));

        const reqFilter = {
            stat_date: { 
                "$between":[dateFrom, dateTo]
            }
        };

        const statistics = await Model.findAll(
            { 
                attributes: ['project_id','project_name','executor_id','executor_name', [sequelize.fn('count', sequelize.col('issue_id')),'issue_cnt']],
                where: reqFilter,
                order: [
                    ['project_name', 'ASC'],
                    ['executor_name', 'ASC'],
                ],            
                group: ['project_id','project_name','executor_id','executor_name'],

            }).catch((err) =>{
                console.log(err);
                res.status(400).send('Statistic are not found');
            });

        res.status(200).send(statistics);

    } else {
        res.status(400).send(false);
    }
};