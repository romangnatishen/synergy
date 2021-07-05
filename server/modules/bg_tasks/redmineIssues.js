module.exports = async (redmineQueryParams) => {

    const apiKeyAdminConfig = require('../redmine/getAdminApiKey');    
    const Redmine = require('node-redmine');
    const hostname = process.env.REDMINE_HOST;    
    const redmineAdminApiKey = await apiKeyAdminConfig();
    const config = {
    apiKey: redmineAdminApiKey
    };

    const redmine = new Redmine(hostname, config);
    return new Promise((resolve, reject) => {
        redmine.issues(redmineQueryParams, function(err, data) {        
                resolve(data);
            }, (err) => {
                reject(err);
            });
        });    
}