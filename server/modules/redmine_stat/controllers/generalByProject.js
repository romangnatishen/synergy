const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {

    const statistics = await Model.findAll(
        { 
            attributes: ['stat_date','project','assigned_to', 'status', [sequelize.fn('count', sequelize.col('issue_id')),'issue_cnt']],
            group: ['stat_date','project','assigned_to','status'],
        }).catch((err) =>{
            console.log(err);
            res.status(400).send('Statistic are not found');
        });

    res.status(200).send(statistics);
};