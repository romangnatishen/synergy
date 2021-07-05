const Model = require('../model');

module.exports = async (req, res) => {

  const Redmine = require('node-redmine');
  const hostname = process.env.REDMINE_HOST;
  
  const redmineApiKey = await apiKeyConfig(req.headers.authorization);
  const config = {
    apiKey: redmineApiKey
  };
  const redmine = new Redmine(hostname, config);

  const filterParams = {
        project_id: projectId,
        include: 'journals',
        status_id: 'open',
      }
  
  redmine.issues(filterParams, function(err, data) {
    if (err) {
        res.status(400).send(data)
    };
      res.status(200).send(data);
    });

};
   
   
   
