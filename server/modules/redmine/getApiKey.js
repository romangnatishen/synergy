const User = require('../user/model');
// const ModificationModel = require('../../modificationHistory/model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (params) => {

    const authorizationHeader = params;
    const access_token = authorizationHeader.split('Bearer ')[1];
    const decoded = jwt.verify(access_token, process.env.PRIVATE_KEY_FOR_JWT);

    const user = await User.findByPk(decoded.id).catch((err) => {
        return 0;
    })

    if (!user) {
        return 0;
    }
    
    return user.redmine_api_key;

}