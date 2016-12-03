const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    var sparql = `
       SELECT ?a ?aLabel ?lat ?long WHERE {
         ?a wdt:P131+ wd:Q3012 .  # administrative territorial entity = Paris
         ?a p:P625 ?statement .
         ?statement psv:P625 ?coordinate_node .
         ?coordinate_node wikibase:geoLatitude ?lat .
         ?coordinate_node wikibase:geoLongitude ?long .
        
         FILTER (ABS(?lat - 48.400722) < 0.01)
         FILTER (ABS(?long - 9.9876367) < 0.01)
        
         SERVICE wikibase:label {
           bd:serviceParam wikibase:language "en" .
         }
        } ORDER BY DESC(?lat)
    `;
    var url = wdk.sparqlQuery(sparql);
    console.log(url);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body, null, 2));
        }
    });
});

module.exports = router;
