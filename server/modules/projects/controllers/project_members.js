var Redmine = require('node-redmine'); 
var hostname = process.env.REDMINE_HOST;
var config = {
  apiKey: process.env.REDMINE_APIKEY
};
 
var redmine = new Redmine(hostname, config);
  
module.exports = async (req, res, next) => {
  redmine.membership_by_project_id(req.query.id, {}, function(err, data) {
    console.log('memberships query',req.query);    
    if (err) {
      console.log(err);
      res.status(400).send(data)
    };
        res.status(200).send(data);
    });
};