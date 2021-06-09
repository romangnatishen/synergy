const Model = require('../model');
// const ModificationModel = require('../../modificationHistory/model');

const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  
      const data = {
        ...req.body        
    };
    const kanbanNewComment = await Model.create(data).catch((err) =>{
        res.status(400).send('Kanban comment is not created');
        });
    res.status(200).send(kanbanNewComment);            
};