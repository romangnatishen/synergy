const Model = require('../model');

module.exports = async (req, res) =>{
    
    let accessAllowed = false;
    const existUser = await Model.findByPk(req.params.id);

    if (req.profile&&existUser) {
        if (req.profile.role===1||req.profile.role===2) {
            accessAllowed = true;
        } else if (req.profile.role===3&&req.profile.client_id===existUser.client_id) {
            accessAllowed = true;
        } 
    }
    if (accessAllowed===true) {
        Model.destroy({
            where: {
                id: req.params.id
            }
        }).catch((err) =>res.starus(400).send({
            message: 'bad request'
        }))
    } else {
      res.status(400).send('Access is forbidden');        
    }

}
