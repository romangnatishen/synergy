const apiKeyConfig = require('../../redmine/getApiKey');

module.exports = async (req, res, next) => {

    const redmineApiKey = await apiKeyConfig(req.headers.authorization);

    if (redmineApiKey) {
      
      const Redmine = require('node-redmine');
      const hostname = process.env.REDMINE_HOST;
      
      const config = {
        apiKey: redmineApiKey
      };
      // console.log(config);

      const redmine = new Redmine(hostname, config);

      redmine.projects(req.query, function(err, data) {
        // console.log(data);
        if (err) {res.status(400).send(data)};
          res.status(200).send(data);
      });

    } else {
      console.log(req.query);
      res.status(400).send('');
    }
};