var express = require('express');
var router = express.Router();
var wdk = require('wikidata-sdk');
var request = require('request');
/* GET home page. */
router.get('/nearby', function (req, res, next) {
    var sparql = "\n       SELECT ?entityRef ?entityRefLabel ?lat ?long WHERE {\n         ?entityRef wdt:P131+ wd:Q3012 .  # administrative territorial entity = Paris\n         ?entityRef p:P625 ?statement .\n         ?statement psv:P625 ?coordinate_node .\n         ?coordinate_node wikibase:geoLatitude ?lat .\n         ?coordinate_node wikibase:geoLongitude ?long .\n        \n         FILTER (ABS(?lat - 48.400722) < 0.01)\n         FILTER (ABS(?long - 9.9876367) < 0.01)\n        \n         SERVICE wikibase:label {\n           bd:serviceParam wikibase:language \"en\" .\n         }\n        } ORDER BY DESC(?lat)\n    ";
    var url = wdk.sparqlQuery(sparql);
    console.log(url);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body, null, 2));
        }
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map