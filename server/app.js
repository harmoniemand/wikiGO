var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var cors = require('cors');
var MongoClient = mongodb.MongoClient;
var MediaWikiStrategy = require('passport-mediawiki-oauth').OAuthStrategy;
var passport = require('passport');
var session = require('express-session');
var app = express();
app.set('json spaces', 2);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
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
        return this.readConfig().then(function () {
            var connectionStr = config.db.connection;
            return MongoClient.connect(connectionStr);
        }).then(function (db) {
            global.db = db;
            var metaCollection = db.collection('meta');
            metaCollection.update({ "_id": "started" }, { $set: { "value": new Date() } }, { upsert: true }).then(function () {
            });
            console.log('Connected to database.');
            try {
                app.use(session({
                    secret: 'keyboard cat',
                    resave: true,
                    saveUninitialized: true
                }));
                passport.use(new MediaWikiStrategy({
                    consumerKey: config.oauth.consumerKey,
                    consumerSecret: config.oauth.consumerSecret,
                    callbackURL: config.oauth.callbackURL
                }, function (token, tokenSecret, profile, done) {
                    console.log("passport handler", arguments);
                    var userId = profile.id;
                    var user = {
                        _id: userId,
                        displayName: profile.displayName,
                        mediawikiGlobalId: profile.id
                    };
                    var usersCollection = db.collection('users');
                    var authsCollection = db.collection('auths');
                    usersCollection.update({ "_id": user._id }, user, { upsert: true }).then(function () {
                        return authsCollection.update({ "_id": token }, {
                            "_id": token,
                            "tokenSecret": tokenSecret,
                            "userId": userId
                        }, { upsert: true });
                    }).then(function () {
                        done(null, user);
                    });
                }));
                passport.serializeUser(function (user, done) {
                    done(null, user._id);
                });
                passport.deserializeUser(function (id, done) {
                    var usersCollection = db.collection('users');
                    usersCollection.findOne({ "_id": id }).then(function (user) {
                        done(null, user);
                    });
                });
                app.use(passport.initialize());
                app.use(passport.session()); // persistent login sessions
            }
            catch (err) {
                console.log(err);
            }
            var apiRoutes = require('./routes/api/index');
            app.use('/api', apiRoutes);
            app.get('/test', function (req, res) {
                var dbgObj = {
                    session: req.session,
                    user: req.user,
                    isAuthenticated: req.isAuthenticated()
                };
                console.log(dbgObj);
                res.json(dbgObj);
            });
            console.log('Ready.');
        });
    };
    ServerApplication.prototype.readConfig = function () {
        var config = fs.readFileSync(path.join(__dirname, 'config', 'app.json'));
        config = config.toString();
        config = JSON.parse(config);
        global.config = config;
        return Promise.resolve();
    };
    return ServerApplication;
}());
var serverApplication = new ServerApplication(app);
serverApplication.main();
module.exports = app;
//# sourceMappingURL=app.js.map