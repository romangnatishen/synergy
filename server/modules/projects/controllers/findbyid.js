const Model = require('../model');

module.exports = async (req, res, next) => {
 
    const currenttUser = await Model.findByPk(req.params.id);

    if (currenttUser) {
        res.status(200).send(currenttUser);
    }

    // if (existUser) {
    //     const updateUser = await Model.update({...req.body})
    //         .catch((err) => {
    //             res.status(200).send({message : 'bad request'})
    //         })
    // }
}