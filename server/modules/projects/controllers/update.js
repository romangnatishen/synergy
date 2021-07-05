const Model = require('../model');

module.exports = async (req, res, next) => {
 
    const existProject = await Model.findByPk(req.params.id);

    if (existProject) {
        const updateProject = await existProject.update({...req.body})
        .catch((err) => {
            res.status(400).send({message : 'bad request'})
        })
        
        res.status(200).send(updateProject);
    }
}