const apiKeyConfig = require('../../redmine/getApiKey');

module.exports = async (req, res, next) => {
  const Redmine = require('node-redmine');
  const hostname = process.env.REDMINE_HOST;
  const redmineApiKey = await apiKeyConfig(req.headers.authorization); 
  const config = {
      apiKey: redmineApiKey
  }; 
  const redmine = new Redmine(hostname, config);
  redmine.users(req.query, function(err, data) {
    if (err) {res.status(400).send(data)};
      res.status(200).send(data);
  });
};