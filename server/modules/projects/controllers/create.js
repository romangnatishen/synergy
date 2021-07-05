const Model = require('../model');

module.exports = async (req, res) => {
    
    const data = {
        ...req.body        
    };

    Model.destroy({
        where: {
            redmine_id: data.redmine_id
        }
    });

    const project = await Model.create(data).catch((err) =>{
        console.log(err);
        res.status(400).send('Project is not created');
        });

    res.status(200).send(project);
};