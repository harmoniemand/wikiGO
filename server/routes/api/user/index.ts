const express = require('express');
const router = express.Router();
const passport = require('passport');

const MEDIAWIKI_AUTH_SCOPE = "";

router.get('/auth/mediawiki',
  passport.authenticate('mediawiki', { scope: MEDIAWIKI_AUTH_SCOPE }));

router.get('/auth/mediawiki/callback',
  passport.authenticate('mediawiki', { failureRedirect: '/' }),
  function(req, res) {
      console.log("Hello from auth.", arguments);
    // Successful authentication, redirect home.
    res.redirect('/auth-success.html');
  });

module.exports = router;
