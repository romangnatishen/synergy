const Model = require('../model');

module.exports = async (req, res, next) => {
 
    let accessAllowed = true;
    const currenttUser = await Model.findByPk(req.params.id);

    // if (req.profile&&currenttUser) {
    //     if (req.profile.role===1||req.profile.role===2) {
    //         accessAllowed = true;
    //     } else if (req.profile.role===3&&req.profile.client_id===currenttUser.client_id) {
    //         accessAllowed = true;
    //     } else if (req.profile.role===4&&req.profile.id===currenttUser.id) {
    //         accessAllowed = true;
    //     } 
    // }

    if (currenttUser&&accessAllowed===true) {
        currenttUser.redmine_api_key = '';
        res.status(200).send(currenttUser);
    } else {
        res.status(200).send({message : 'Access is forbidden'})
    }

    // if (existUser) {
    //     const updateUser = await Model.update({...req.body})
    //         .catch((err) => {
    //             res.status(200).send({message : 'bad request'})
    //         })
    // }
}