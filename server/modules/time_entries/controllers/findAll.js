var Redmine = require('node-redmine'); 
const hostname = process.env.REDMINE_HOST;
const apiKeyConfig = require('../../redmine/getApiKey');

module.exports = async (req, res, next) => {

  const redmineApiKey = await apiKeyConfig(req.headers.authorization); 
  const config = {
      apiKey: redmineApiKey
  };   
  const redmine = new Redmine(hostname, config);

  redmine.time_entries(req.body, function(err, data) {
    if (err) {
        res.status(400).send(data)
    };
    res.status(200).send(data);
    });
};