const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const index = require('./routes/api/index');

const app = express();
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
app.use(function(req, res, next) {
    res.write('404 :(');
    res.end();
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

class ServerApplication {

    private _config : any;

    constructor(private _app) {

    }

    public main() {
        return this.readConfig().then(() => {
            let connectionStr = this._config.db.connection;
            return MongoClient.connect(connectionStr);
        }).then((db) => {
            console.log('Connected to database.');
        });
    }

    private readConfig() {
        let config = fs.readFileSync(path.join(__dirname, 'config', 'app.json'));
        config = config.toString();
        config = JSON.parse(config);
        this._config = config;
        return Promise.resolve();
    }

}

let serverApplication = new ServerApplication(app);
serverApplication.main();

module.exports = app;
