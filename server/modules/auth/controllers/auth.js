const User = require('../../user/model');
// const ModificationModel = require('../../modificationHistory/model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {

    const descriptionData = {
        user: req.body.email
    };

    const user = await User.findOne({
        where: {
            email: req.body.email,
            user_status: 1
        }
    }).catch(err => {

        // modificationData = {
        //     user_id: undefined,
        //     action: 5, // failed to login
        //     objectType: 'login',
        //     objectID: undefined,
        //     description: JSON.stringify(descriptionData)
        // };

        // const modificationEvent = ModificationModel.create(modificationData);
        console.log(err);
        res.status(400).send({    
            message: 'Bad request'
        })
    })

    if (!user) {
        descriptionData.description = "Brak użytkownika w systemie";

        modificationData = {
            user_id: undefined,
            action: 5, // failed to login
            objectType: 'login',
            objectID: undefined,
            description: JSON.stringify(descriptionData)
        };

        // const modificationEvent = await ModificationModel.create(modificationData).catch((err) => {
        //     console.log(err);
        // });

        res.status(404).send({
            message: 'User not found'
        })
        return;
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {

        descriptionData.description = "Błędne hasło";
        modificationData = {
            user_id: user.id,
            action: 5, // failed to login
            objectType: 'login',
            objectID: user.id,
            description: JSON.stringify(descriptionData)
        };

        // const modificationEvent = await ModificationModel.create(modificationData).catch((err) => {
        //     console.log(err);
        // });

        res.status(401).send({
            message: 'unauthorized'
        }
        )
        return;
    }
    const access_token = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY_FOR_JWT, {
        // const access_token = jwt.sign({id: user.id, uuid: req.body.uuid}, process.env.PRIVATE_KEY_FOR_JWT, {
        expiresIn: '360h'
    });

    descriptionData.description = "Pomyślne logowanie";
    modificationData = {
        user_id: user.id,
        action: 4, // failed to login
        objectType: 'login',
        objectID: user.id,
        description: JSON.stringify(descriptionData)
    };

    // const modificationEvent = await ModificationModel.create(modificationData).catch((err) => {
    //     console.log(err);
    // });

    res.status(200).send({ access_token });
}