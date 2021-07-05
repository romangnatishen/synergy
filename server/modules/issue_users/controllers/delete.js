const Model = require('../model');

module.exports = async (req, res) =>{
    
    const filter = req.body;
    Model.destroy(filter).catch((err) =>res.starus(400).send({
        message: 'bad request'
    }))
    res.status(200).send(true);
}
