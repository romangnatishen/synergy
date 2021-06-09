const User = require('../model');

module.exports = async (req, res) =>{
    User.destroy({
        where: {
            id: req.params.id
        }
    }).catch((err) =>res.starus(400).send({
        message: 'bad request'
    }))
}
