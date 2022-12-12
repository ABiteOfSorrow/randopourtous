import createError from 'http-errors';
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require("express-fileupload");
const fs = require('fs');

import indexRouter from './routes/index';
const usersRouter = require('./routes/users');

let tempDir = './tmp';
if (!fs.existsSync(tempDir)){
  fs.mkdir(tempDir, { recursive: true });
}

const importedApp = express();
importedApp.use(fileUpload());

importedApp.use(logger('dev'));
importedApp.use(express.json());
importedApp.use(express.urlencoded({ extended: false }));
importedApp.use(cookieParser());
importedApp.use(express.static(path.join(__dirname, 'public')));

importedApp.use('/', indexRouter);
importedApp.use('/users', usersRouter);

// catch 404 and forward to error handler
importedApp.use((req, res, next) => {
  next(createError(404));
});

// error handler
importedApp.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = importedApp.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ status: "failed" })
});

export default importedApp;