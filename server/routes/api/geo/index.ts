const express = require('express');
const router = express.Router();
const wdk = require('wikidata-sdk');
const rp = require('request-promise');
const Handlebars = require('handlebars');

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
       SELECT ?entityRef ?entityRefLabel ?lat ?long WHERE {
         ?entityRef wdt:P131+ wd:Q3012 .  # administrative territorial entity = Paris
         ?entityRef p:P625 ?statement .
         ?statement psv:P625 ?coordinate_node .
         ?coordinate_node wikibase:geoLatitude ?lat .
         ?coordinate_node wikibase:geoLongitude ?long .
        
         FILTER (ABS(?lat - {{lat}}) < 0.01)
         FILTER (ABS(?long - {{lon}}) < 0.01)
        
         SERVICE wikibase:label {
           bd:serviceParam wikibase:language "en" .
         }
        } ORDER BY DESC(?lat)
    `;
        let queryTpl = Handlebars.compile(querySource);
        let sparql = queryTpl({
            lon: lon,
            lat: lat
        });
        console.log(sparql);
        var url = wdk.sparqlQuery(sparql);
        console.log(url);
        return rp({uri: url, json: true});
    }).then((body) => {
        res.json(body);
    });
});

module.exports = router;
