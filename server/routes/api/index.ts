const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/geo', require('./geo/index'));
router.use('/user', require('./user/index'));

module.exports = router;
