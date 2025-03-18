var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/dbConnection');
const cors = require('cors');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var adminRouter = require('./routes/admin');

var indexRouter = require('./routes');
var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Log when middleware is set up
console.log("Middleware setup completed.");


// // Initialize session management for Passport
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false
// }));

// // Initialize Passport and session support
// app.use(passport.initialize());
// app.use(passport.session());

// Routes setup
app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/auth', authRoutes);
// app.use('/admin', adminRoutes);
// app.use('/admin', adminRouter);

// Log when routes are set up
console.log("Routes setup completed.");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(`404 error - ${req.originalUrl} not found.`);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(`Error occurred: ${err.message}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 3000;


sequelize
    .authenticate()
    .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to the database:", err));

app.listen(port, function() {
  console.log(`Server started and running on port ${port}`);
});

module.exports = app;
