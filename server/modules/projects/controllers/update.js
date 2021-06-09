const Model = require('../model');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
 
    const existUser = await Model.findByPk(req.params.id);

    if (existUser) {
        if (req.body.password&&req.body.password!=="")  {
            req.body.password = await bcrypt.hash(req.body.password,12);
        } else (
            delete req.body["password"]
        )
        const updateUser = await existUser.update({...req.body})
            .catch((err) => {
                res.status(400).send({message : 'bad request'})
            })
            
            res.status(200).send(updateUser);
    }
}