const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const request = require('request');

/* GET home page. */
router.use('/geo', require('./geo/index.ts'));

module.exports = router;
