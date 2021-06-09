  module.exports = async (req, res, next) => {
  
var Redmine = require('node-redmine');
 
  const hostname = process.env.REDMINE_HOST;
  const config = {
    apiKey: JSON.parse(req.query.redmineConfig).apiKey
  };
  
  const redmine = new Redmine(hostname, config);

  redmine.issues(req.query, function(err, data) {
    if (err) {
        res.status(400).send(data)
    };
    res.status(200).send(data);
    });
};