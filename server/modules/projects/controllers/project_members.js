var Redmine = require('node-redmine'); 
var hostname = process.env.REDMINE_HOST;
const apiKeyConfig = require('../../redmine/getApiKey');
  
module.exports = async (req, res, next) => {

  const redmineApiKey = await apiKeyConfig(req.headers.authorization); 
  const config = {
      apiKey: redmineApiKey
  };
  
  const redmine = new Redmine(hostname, config);

  redmine.membership_by_project_id(req.query.id, req.query, function(err, data) {
    if (err) {
      console.log(err);
      res.status(400).send(data)
    };
      res.status(200).send(data);
    });
};