
const express = require('express');
const router = express.Router();

var MediaWikiStrategy = require('passport-mediawiki-oauth').OAuthStrategy;


router.use(new MediaWikiStrategy({
    consumerKey: config.oauth.consumerKey,
    consumerSecret: config.oauth.consumerSecret,
    callbackURL: config.oauth.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ mediawikiGlobalId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


router.get('/auth/mediawiki',
  passport.authenticate('mediawiki', { scope: MEDIAWIKI_AUTH_SCOPE }));
 
app.get('/auth/mediawiki/callback', 
  passport.authenticate('mediawiki', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
