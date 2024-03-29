const apiKeyConfig = require('../../redmine/getApiKey');
// const adminApiKeyConfig = require('../../redmine/getAdminApiKey');

module.exports = async (req, res, next) => {
  const Redmine = require('node-redmine');
  const hostname = process.env.REDMINE_HOST;
  // const redmineApiKey = await adminApiKeyConfig(); 
  const redmineApiKey = await apiKeyConfig(req.headers.authorization);
  const config = {
    apiKey: redmineApiKey
  };
  const redmine = new Redmine(hostname, config);
  let currentUser = await redmine.current_user(req.query, function(err, data) {
    if (err) {res.status(400).send(data)};
      res.status(200).send(data);
  });

};