var express = require('express');
var router = express.Router();
var wdk = require('wikidata-sdk');
var rp = require('request-promise');
var Handlebars = require('handlebars');
/* GET home page. */
router.get('/nearby', function (req, res, next) {
    console.log(req.query);
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    var geo = {
        "type": "Point",
        "coordinates": [lon, lat]
    };
    console.log("geo", geo);
    var reverseGeoUrl = 'http://nominatim.openstreetmap.org/reverse?format=json&lat={{lat}}&lon={{lon}}'.replace('{{lat}}', lat).replace('{{lon}}', lon);
    rp({
        uri: reverseGeoUrl,
        headers: {
            'User-Agent': 'F00Bar2000'
        }, json: true
    }).then(function (body) {
        var shortAddress = {
            country: body.address.country,
            state: body.address.state,
            postcode: body.address.postcode,
            city: body.address.city
        };
        console.log(shortAddress);
        var querySource = "\n       SELECT ?entityRef ?entityRefLabel ?lat ?long WHERE {\n         ?entityRef wdt:P131+ wd:Q3012 .  # administrative territorial entity = Paris\n         ?entityRef p:P625 ?statement .\n         ?statement psv:P625 ?coordinate_node .\n         ?coordinate_node wikibase:geoLatitude ?lat .\n         ?coordinate_node wikibase:geoLongitude ?long .\n        \n         FILTER (ABS(?lat - {{lat}}) < 0.01)\n         FILTER (ABS(?long - {{lon}}) < 0.01)\n        \n         SERVICE wikibase:label {\n           bd:serviceParam wikibase:language \"en\" .\n         }\n        } ORDER BY DESC(?lat)\n    ";
        var queryTpl = Handlebars.compile(querySource);
        var sparql = queryTpl({
            lon: lon,
            lat: lat
        });
        console.log(sparql);
        var url = wdk.sparqlQuery(sparql);
        console.log(url);
        return rp({ uri: url, json: true });
    }).then(function (body) {
        res.json(body);
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map