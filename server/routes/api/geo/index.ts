const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const rp = require('request-promise');
const Handlebars = require('handlebars');
const merge = require('merge');

/* GET home page. */
router.get('/nearby', function (req, res, next) {
    console.log(req.query);
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    var geo = {
        "type": "Point",
        "coordinates": [lon, lat]
    };
    console.log("geo", geo);
    let reverseGeoUrl = 'http://nominatim.openstreetmap.org/reverse?format=json&lat={{lat}}&lon={{lon}}'.replace('{{lat}}', lat).replace('{{lon}}', lon);
    rp({
        uri: reverseGeoUrl,
        headers: {
            'User-Agent': 'F00Bar2000'
        }, json: true
    }).then((body) => {
        let shortAddress = {
            country: body.address.country,
            state: body.address.state,
            postcode: body.address.postcode,
            city: body.address.city
        };
        console.log(shortAddress);
        let querySource = `
        SELECT ?entityReference ?entityReferenceLabel ?lat ?long ?dist WHERE {
 
 ?city wdt:P281 "{{postcode}}".
 
?entityReference wdt:P131+ ?city .  # administrative territorial entity = Paris
?entityReference p:P625 ?statement .
?statement psv:P625 ?coordinate_node .
?coordinate_node wikibase:geoLatitude ?lat .
?coordinate_node wikibase:geoLongitude ?long .

FILTER (ABS(?lat - {{point.lat}}) < {{maxDistance}})
FILTER (ABS(?long - {{point.lon}}) < {{maxDistance}})
 
 
 ?entityReference wdt:P625 ?berlinLoc . 
 wd:Q1384 wdt:P625 ?newyorkLoc
          
 BIND(geof:distance(?berlinLoc,  "Point({{point.lon}} {{point.lat}})"^^geo:wktLiteral) as ?dist) 
   
SERVICE wikibase:label {
  bd:serviceParam wikibase:language "de","en" .
}
} ORDER BY ?dist
    `;
        let queryTpl = Handlebars.compile(querySource);
        let sparql = queryTpl({
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
        return rp({uri: url, json: true});
    }).then((body) => {
        console.dir(body);
        let results = body.results.bindings.map((current) => {
            let result = {
                _id: current.entityReference.value.replace('http://www.wikidata.org/entity/', ''),
                 geo : {
                    "type": "Point",
                    "coordinates": [parseFloat(current.long.value), parseFloat(current.lat.value)]
                },
                name: current.entityReferenceLabel.value,
                distance: parseFloat(current.dist.value)
            };
            return result;
        });
        let placesCollection = db.collection("places");
        let updatePlacesPromises = results.map((result) => {
            let place = merge(true, result);
            delete place.distance;
            return placesCollection.update({"_id":result._id}, place, {upsert:true});
        });
        Promise.all(updatePlacesPromises).then(() => {
            res.json(results);
        });
    });
});

module.exports = router;
