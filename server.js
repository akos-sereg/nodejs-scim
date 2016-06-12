var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var domain = require('./domain');
var logger = require('./logger');
var endpoints = require('./endpoints');
var authorization = require('./authorization');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger.loggerInterceptor())
app.use(authorization.authorizationInterceptor({ bearer: 'alma' }));

endpoints.initUserEndpoints(app, domain);
endpoints.initGroupEndpoints(app, domain);
endpoints.catchAll(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
