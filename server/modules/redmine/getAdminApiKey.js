const User = require('../user/model');

module.exports = async () => {

    let admin_api_key = '';
    const users = await User.findAll(
        {
            where : {
                name : process.env.REDMINE_ADMIN
            }
        }
    );
    console.log('users', users);
    if (users) {
        users.forEach(el => {
            admin_api_key = el.redmine_api_key;            
        });
    }
    console.log('filter',filter);
    console.log('admin api key',admin_api_key);

    return admin_api_key;
}