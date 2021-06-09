const Model = require('../model');
// const ModificationModel = require('../../modificationHistory/model');

const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  
    const data = {
        ...req.body        
    };

    // let accessAllowed = false;
    // if (req.profile) {
    //     if (req.profile.role===1||req.profile.role===2) {
    //         accessAllowed = true;
    //     } else if (req.profile.role===3&&req.profile.client_id===data.body.client_id) {
    //         accessAllowed = true;
    //     } 
    // }
    
    // if (accessAllowed===true) {
        data.body.password = await bcrypt.hash(data.body.password,12);
        const user = await Model.create(data.body).catch((err) =>{
            console.log(err);
            res.status(400).send('User is not created');
            });

        // if (user) {
        //     modificationData={
        //         user_id:req.profile.id,
        //         user_email:req.profile.email,
        //         action:1, // new record
        //         objectType:'user',
        //         objectID:user.id,
        //         description:JSON.stringify(data.body)
        //     };
            // const modificationEvent = await ModificationModel.create(modificationData).catch((err) => {
            //     console.log(err);
            //     });
        // }

        res.status(200).send(user);
    // } else {
    //     res.status(400).send('Access is forbidden');
    // }

};