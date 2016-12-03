var express = require('express');
var router = express.Router();
/* GET home page. */
router.use('/geo', require('./geo/index'));
router.use('/user', require('./user/index'));
module.exports = router;
//# sourceMappingURL=index.js.map