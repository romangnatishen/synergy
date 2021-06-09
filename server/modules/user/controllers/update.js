const Model = require('../model');
// const ModificationModel = require('../../modificationHistory/model');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
 
    const existUser = await Model.findByPk(req.params.id);

    let accessAllowed = true;
    // if (req.profile) {
    //     if (req.profile.role===1||req.profile.role===2) {
    //         accessAllowed = true;
    //     } else if (req.profile.role===3&&req.profile.client_id===existUser.client_id) {
    //         accessAllowed = true;
    //     } else if (req.profile.role===4&&req.profile.id===existUser.id) {
    //         accessAllowed = true;
    //     } 
    // }

    if (existUser&&accessAllowed===true) {
        if (req.body.password&&req.body.password!=="")  {
            req.body.password = await bcrypt.hash(req.body.password,12);
        } else (
            delete req.body["password"]
        )

        let modificationDescription = {};
        for (const prop in existUser.dataValues) {
            if (existUser.dataValues[prop]!=req.body[prop]) {
                modificationDescription[prop] = req.body[prop];
            }
        }
        modificationData={
            user_id:req.profile.id,
            user_email:req.profile.email,
            action:2, 
            objectType:'user',
            objectID:req.params.id,
            description: JSON.stringify(modificationDescription)
        };

        // const modificationEvent = await ModificationModel.create(modificationData).catch((err) => {
        //     console.log(err);
        //     });

        const updateUser = await existUser.update({...req.body})
            .catch((err) => {
                res.status(400).send({message : 'bad request'})
            })
                        
            res.status(200).send(updateUser);
    } else {
        res.status(400).send({message : 'Access is forbidden'})
    }
}