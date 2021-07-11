const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {
    const reqParams = req.query;
    if (reqParams) {
        const dateFrom = new Date(String(reqParams.date_from));
        const dateTo = new Date(String(reqParams.date_to));
        const reqFilter = {
            stat_date:{ 
                "$between":[dateFrom, dateTo]
            }        
        };
        const statistics = await Model.findAll(
            { 
                attributes: ['stat_date', [sequelize.fn('count', sequelize.col('issue_id')),'issue_cnt']],
                where: reqFilter,
                order: [
                    ['stat_date', 'ASC'],
                ],            
                group: ['stat_date'],
            }).catch((err) =>{
                console.log(err);
                res.status(400).send('Statistic are not found');
            });

        res.status(200).send(statistics);
    } else {
        res.status(400).send(false);
    }
};