const Redmine = require('node-redmine'); 
const hostname = process.env.REDMINE_HOST;

const apiKeyConfig = require('../../redmine/getApiKey');
  
module.exports = async (req, res, next) => {

  const redmineApiKey = await apiKeyConfig(req.headers.authorization);
  const config = {
      apiKey: redmineApiKey
  };
  
  const redmine = new Redmine(hostname, config);
  
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
        } else {
            console.log(errJSON);
            res.status(400).send(data)
        }
    };
      res.status(200).send(data);
    });
};