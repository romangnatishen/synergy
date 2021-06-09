const Model = require('../model');

module.exports = async (req, res) => {
    const data = {
        ...req.body        
    };
    const calendarEvent = await Model.create(data.body).catch((err) =>{
        console.log(err);
        res.status(400).send('User is not created');
        });

        res.status(200).send(calendarEvent);
};