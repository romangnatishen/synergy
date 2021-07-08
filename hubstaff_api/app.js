const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index.js');
const organizationsRouter = require('./routes/organizations.js');
const projectsRouter = require('./routes/projects.js');
const timesheetsRouter = require('./routes/timesheets.js');
const usersRouter = require('./routes/users.js');
const taskRouter = require('./routes/task.js');

const verifyProfile = require('./middleware/verifyProfile');

// const verifyProfile = require('../server/middleware/verifyProfile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token, x-api-key, device_uuid');
  next();
})

app.use('/', indexRouter);
app.use('/organizations', organizationsRouter);
app.use('/projects', verifyProfile, projectsRouter);
app.use('/timesheets', timesheetsRouter);
app.use('/users', usersRouter);
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
