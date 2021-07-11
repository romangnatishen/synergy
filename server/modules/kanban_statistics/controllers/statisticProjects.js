const Model = require('../model');
const sequelize = require('sequelize');

module.exports = async (req, res, next) => {

    const statistics = await Model.findAll(
        { 
            attributes:[
             [sequelize.fn('DISTINCT', sequelize.col('project_id')), 'project_id'],
             'project_name',
            ] 
        }).catch((err) =>{
            console.log(err);
            res.status(400).send('Projects are not found');
        });

    res.status(200).send(statistics);
};