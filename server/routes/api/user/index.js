var express = require('express');
var router = express.Router();
var passport = require('passport');
var MEDIAWIKI_AUTH_SCOPE = "";
router.get('/auth/mediawiki', passport.authenticate('mediawiki', { scope: MEDIAWIKI_AUTH_SCOPE }));
router.get('/auth/mediawiki/callback', passport.authenticate('mediawiki', { failureRedirect: '/' }), function (req, res) {
    console.log("Hello from auth.", arguments);
    // Successful authentication, redirect home.
    res.redirect('/auth-success.html');
});
module.exports = router;
//# sourceMappingURL=index.js.map