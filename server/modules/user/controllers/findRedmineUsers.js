  module.exports = async (req, res, next) => {
    
    if (req.query.redmineConfig) {
      const apiConfig = JSON.parse(req.query.redmineConfig);

      const Redmine = require('node-redmine');
      const hostname = process.env.REDMINE_HOST;
      
      const config = {
        apiKey: apiConfig.apiKey
      };
      // console.log(config);

      const redmine = new Redmine(hostname, config);

      redmine.users(req.query, function(err, data) {
        if (err) {res.status(400).send(data)};
          res.status(200).send(data);
      });

    } else {
      console.log(req.query);
      res.status(400).send('');
    }
};