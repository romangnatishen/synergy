const Model = require('../model');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const data = {
        ...req.body        
    };
    data.body.password = await bcrypt.hash(data.body.password,12);
    const user = await Model.create(data.body).catch((err) =>{
        console.log(err);
        res.status(400).send('User is not created');
});

    res.status(200).send(user);
};