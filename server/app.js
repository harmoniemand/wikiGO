var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var index = require('./routes/api/index');
var app = express();
app.set('json spaces', 2);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', index);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.write('404 :(');
    res.end();
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
var ServerApplication = (function () {
    function ServerApplication(_app) {
        this._app = _app;
    }
    ServerApplication.prototype.main = function () {
        var _this = this;
        return this.readConfig().then(function () {
            var connectionStr = _this._config.db.connection;
            return MongoClient.connect(connectionStr);
        }).then(function (db) {
            console.log('Connected to database.');
        });
    };
    ServerApplication.prototype.readConfig = function () {
        var config = fs.readFileSync(path.join(__dirname, 'config', 'app.json'));
        config = config.toString();
        config = JSON.parse(config);
        this._config = config;
        return Promise.resolve();
    };
    return ServerApplication;
}());
var serverApplication = new ServerApplication(app);
serverApplication.main();
module.exports = app;
//# sourceMappingURL=app.js.map