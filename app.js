const	createError = require('http-errors'),
		express = require('express'),
		path = require('path'),
		cookieParser = require('cookie-parser'),
		logger = require('morgan'),
		// stylus = require('stylus'),
		nib = require('nib'),
		fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

global.rootdir = path.resolve(__dirname);
global.pd = JSON.parse(fs.readFileSync(global.rootdir + '/assets/project-data.json'));

global.app = express();
var app = global.app;

app.set('env', 'dev');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(stylus.middleware({
// 	src: __dirname + '/public',
// 	compile: function(str, path) {
// 		return stylus(str).set('filename', path).use(nib());
// 	}
// }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
