var Redmine = require('node-redmine');
 
var hostname = process.env.REDMINE_HOST;
var config = {
  apiKey: process.env.REDMINE_APIKEY
};
 
var redmine = new Redmine(hostname, config);
  
module.exports = async (req, res, next) => {
    const redmineQuery = req.query.redmineQuery;
    redmine.get_issue_by_id(Number(req.query.taskId),redmineQuery, function(err, data) {
    if (err) {
        res.status(400).send(data)
    };
        // console.log("issue data");
        // console.log(data);
        res.status(200).send(data);
    });
};