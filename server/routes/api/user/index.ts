const express = require('express');
const router = express.Router();

const MediaWikiStrategy = require('passport-mediawiki-oauth').OAuthStrategy;
const passport = require('passport');
const MEDIAWIKI_AUTH_SCOPE = "";

console.log(config);

router.use(new MediaWikiStrategy({
    consumerKey: config.oauth.consumerKey,
    consumerSecret: config.oauth.consumerSecret,
    callbackURL: config.oauth.callbackURL
  },
  function(token, tokenSecret, profile, done) {

  }
));


router.get('/auth/mediawiki',
  passport.authenticate('mediawiki', { scope: MEDIAWIKI_AUTH_SCOPE }));

router.get('/auth/mediawiki/callback',
  passport.authenticate('mediawiki', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
