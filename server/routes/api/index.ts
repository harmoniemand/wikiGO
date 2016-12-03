const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const request = require('request');

/* GET home page. */
router.use('/geo', require('./geo/index.ts'));
router.use('/user', require('./user/index.ts'));

module.exports = router;
