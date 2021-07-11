const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {

    const statistics = await Model.findAll(
        { 
            attributes:[
             [sequelize.fn('DISTINCT', sequelize.col('kanban_status_id')), 'kanban_status_id'],
            ] 
        }).catch((err) =>{
            console.log(err);
            res.status(400).send('Statuses are not found');
        });

    res.status(200).send(statistics);
};