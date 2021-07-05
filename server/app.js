const express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config();

const userRouter = require('./modules/user/routes');
const projectsRouter = require('./modules/projects/routes');
const kanbanRouter = require('./modules/kanban_issue/routes');
const kanbanCommentRouter = require('./modules/kanban_comment/routes');

const issueStatusesRouter = require('./modules/issue_statuses/routes');
const issuesRouter = require('./modules/issues/routes');
const timeentriesRouter = require('./modules/time_entries/routes');

const calendar_events = require('./modules/calendar_events/routes');
const calendar_participants = require('./modules/calendar_participants/routes');

const issue_users = require('./modules/issue_users/routes');

const redmine_stats = require('./modules/redmine_stat/routes');
const projects = require('./modules/projects/routes');

// const contractRouter = require('./modules/contract/routes');
const authRouter = require('./modules/auth/routes');

const sequelize = require('./core/db_conn');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token, x-api-key, device_uuid');
  next();
})

// // parse application/json
app.use(kanbanRouter);
app.use(kanbanCommentRouter);
app.use(userRouter);
app.use(issueStatusesRouter);
app.use(projectsRouter);
app.use(issuesRouter);
app.use(timeentriesRouter);
app.use(calendar_events);
app.use(calendar_participants);
app.use(issue_users);
app.use(projects);

app.use(redmine_stats);
// app.use(contractRouter);
app.use(authRouter);

console.log('Initializing server ...');

sequelize
  .authenticate()
  .then(() => {
    require('./core/entity_sync')();
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(process.env.SERVER_PORT, () => { console.log(`Server works on http://localhost:${process.env.SERVER_PORT}`) });