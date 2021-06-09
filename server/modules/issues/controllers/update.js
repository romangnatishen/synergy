var Redmine = require('node-redmine');
 
var hostname = process.env.REDMINE_HOST;
var config = {
  apiKey: process.env.REDMINE_APIKEY
};
 
var redmine = new Redmine(hostname, config);
  
module.exports = async (req, res, next) => {
    const redmineQuery = JSON.parse(req.query.redmineQuery);
    redmine.update_issue(req.query.taskId,redmineQuery, function(err, data) {
    if (err) {
        let isErr = true;
        errJSON = JSON.parse(err);
        if (errJSON) {
           if (errJSON.ErrorCode) {
               if (errJSON.ErrorCode===204) {
                isErr = false;
               }
           } 
        }

        if (isErr===false) {
            res.status(200).send('')
        } else  res.status(400).send(data)
    };
      res.status(200).send(data);
    });
};