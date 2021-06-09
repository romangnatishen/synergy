const Model = require('../model');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {

    const deleteFilter = JSON.parse(req.body.deleteFilter);
    await Model.destroy(deleteFilter)
        .then(function (deletedRecord) {
            res.status(200).send(true);
        })
        .catch(function (error){
            res.status(400).send(false);
        });
}