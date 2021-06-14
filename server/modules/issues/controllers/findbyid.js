const Redmine = require('node-redmine'); 
const hostname = process.env.REDMINE_HOST;
const apiKeyConfig = require('../../redmine/getApiKey');
  
module.exports = async (req, res, next) => {
    
    const redmineApiKey = await apiKeyConfig(req.headers.authorization);
    const config = {
        apiKey: redmineApiKey
    };
    
    const redmine = new Redmine(hostname, config);

    const redmineQuery = req.query.redmineQuery;
    redmine.get_issue_by_id(Number(req.query.taskId),redmineQuery, function(err, data) {
    if (err) {
        console.log(err);
        res.status(400).send(data)
    };
        // console.log("issue data");
        // console.log(data);
        res.status(200).send(data);
    });
};