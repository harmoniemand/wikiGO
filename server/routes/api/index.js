var express = require('express');
var router = express.Router();
var wdk = require('wikidata-sdk');
var request = require('request');
/* GET home page. */
router.use('/geo', require('./geo/index.ts'));
module.exports = router;
//# sourceMappingURL=index.js.map