var Redmine = require('node-redmine');
 
// protocol required in Hostname, supports both HTTP and HTTPS
var hostname = process.env.REDMINE_HOST;
var config = {
  apiKey: process.env.REDMINE_APIKEY
};
 
var redmine = new Redmine(hostname, config);
  
module.exports = async (req, res, next) => {
    redmine.time_entries(req.body, function(err, data) {
    if (err) {
        res.status(400).send(data)
    };
    res.status(200).send(data);
    });
};