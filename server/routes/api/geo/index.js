var express = require('express');
var router = express.Router();
var wdk = require('wikidata-sdk');
var rp = require('request-promise');
var Handlebars = require('handlebars');
var merge = require('merge');
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
        var querySource = "\n        SELECT ?entityReference ?entityReferenceLabel ?lat ?long ?dist WHERE {\n \n ?city wdt:P281 \"{{postcode}}\".\n \n?entityReference wdt:P131+ ?city .  # administrative territorial entity = Paris\n?entityReference p:P625 ?statement .\n?statement psv:P625 ?coordinate_node .\n?coordinate_node wikibase:geoLatitude ?lat .\n?coordinate_node wikibase:geoLongitude ?long .\n\nFILTER (ABS(?lat - {{point.lat}}) < {{maxDistance}})\nFILTER (ABS(?long - {{point.lon}}) < {{maxDistance}})\n \n \n ?entityReference wdt:P625 ?berlinLoc . \n wd:Q1384 wdt:P625 ?newyorkLoc\n          \n BIND(geof:distance(?berlinLoc,  \"Point({{point.lon}} {{point.lat}})\"^^geo:wktLiteral) as ?dist) \n   \nSERVICE wikibase:label {\n  bd:serviceParam wikibase:language \"de\",\"en\" .\n}\n} ORDER BY ?dist\n    ";
        var queryTpl = Handlebars.compile(querySource);
        var sparql = queryTpl({
            point: {
                lon: lon,
                lat: lat
            },
            postcode: shortAddress.postcode,
            maxDistance: 0.05
        });
        console.log(sparql);
        var url = wdk.sparqlQuery(sparql);
        console.log(url);
        return rp({ uri: url, json: true });
    }).then(function (body) {
        console.dir(body);
        var results = body.results.bindings.map(function (current) {
            var result = {
                _id: current.entityReference.value.replace('http://www.wikidata.org/entity/', ''),
                geo: {
                    "type": "Point",
                    "coordinates": [parseFloat(current.long.value), parseFloat(current.lat.value)]
                },
                name: current.entityReferenceLabel.value,
                distance: parseFloat(current.dist.value)
            };
            return result;
        });
        var placesCollection = db.collection("places");
        var updatePlacesPromises = results.map(function (result) {
            var place = merge(true, result);
            delete place.distance;
            return placesCollection.update({ "_id": result._id }, place, { upsert: true });
        });
        Promise.all(updatePlacesPromises).then(function () {
            res.json(results);
        });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map