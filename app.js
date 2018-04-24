const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const url = require('./app/url/routes');
const visit = require('./app/visit/routes');
const shortener = require('./app/shortener/routes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/ui', express.static(path.join(__dirname, 'dist')));
app.use('/ui/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: path.join(__dirname, 'dist') });
});
app.use('/api/visits', visit);
app.use('/api/url', url);
app.use(shortener);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
	const accepts = req.get("Accept");
	

	if (accepts == 'application/json'){
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.json({
			message: err.message,
			code: err.status
		});
	}else{
		res.redirect('/ui/404');
		res.end();
	}
});

module.exports = app;
