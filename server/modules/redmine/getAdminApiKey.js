const User = require('../user/model');

module.exports = async () => {

    const filter = {
        where:{
            name:process.env.REDMINE_ADMIN
            }
        };
    let admin_api_key = '';
    const users = await User.findAll(filter);
    if (users) {
        users.forEach(el => {
            admin_api_key = el.redmine_api_key;            
        });
    }
    console.log('filter',filter);
    console.log('admin api key',admin_api_key);

    return admin_api_key;
}