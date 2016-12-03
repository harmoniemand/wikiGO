const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MediaWikiStrategy = require('passport-mediawiki-oauth').OAuthStrategy;
const passport = require('passport');
const session = require('express-session');

const app = express();
app.set('json spaces', 2);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
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

class ServerApplication {

    private _config: any;

    constructor(private _app) {

    }

    public main() {
        return this.readConfig().then(() => {
            let connectionStr = config.db.connection;
            return MongoClient.connect(connectionStr);
        }).then((db) => {
            global.db = db;
            var metaCollection = db.collection('meta');
            metaCollection.update({"_id": "started"}, {$set: {"value": new Date()}}, {upsert: true}).then(() => {

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
                    },
                    function (token, tokenSecret, profile, done) {
                        console.log("passport handler", arguments);
                        let userId = profile.id;
                        let user = {
                            _id: userId,
                            displayName: profile.displayName,
                            mediawikiGlobalId: profile.id
                        };
                        let usersCollection = db.collection('users');
                        let authsCollection = db.collection('auths');
                        usersCollection.update({"_id": user._id}, user, {upsert: true}).then(() => {
                            return authsCollection.update({"_id": token}, {
                                    "_id": token,
                                    "tokenSecret": tokenSecret,
                                    "userId": userId
                                }
                                , {upsert: true});
                        }).then(() => {
                            done(null, user);
                        });
                    }
                ));
                passport.serializeUser(function(user, done) {
                    done(null, user._id);
                });

                passport.deserializeUser(function(id, done) {
                    let usersCollection = db.collection('users');
                    usersCollection.findOne({"_id": id}).then((user) => {
                        done(null, user);
                    });
                });
                app.use(passport.initialize());
                app.use(passport.session()); // persistent login sessions
            } catch (err) {
                console.log(err);
            }
            const apiRoutes = require('./routes/api/index');
            app.use('/api', apiRoutes);
            app.get('/test', (req, res) => {
                let dbgObj = {
                    session : req.session,
                    user : req.user,
                    isAuthenticated: req.isAuthenticated()
                };
                console.log(dbgObj);
                res.json(dbgObj);
            });
            console.log('Ready.');
        });
    }

    private readConfig() {
        let config = fs.readFileSync(path.join(__dirname, 'config', 'app.json'));
        config = config.toString();
        config = JSON.parse(config);
        global.config = config;
        return Promise.resolve();
    }

}

let serverApplication = new ServerApplication(app);
serverApplication.main();

module.exports = app;
