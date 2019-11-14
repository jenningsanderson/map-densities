'use strict'

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');

tileReduce({
    map: path.join(__dirname, "map.js"),
    zoom: 12,
    sources: [{name: 'osm', mbtiles: path.join('../../latest.planet-compact.mbtiles'), raw: false}],
    output: fs.createWriteStream('../output.csv'),
//     bbox: [93.5,-11.14,129.74,10.19], //SE Asia
    // bbox: [99.6,-6.1,108.62,6.58], //smaller SE Asia
    // bbox: [-76.6374,39.1585,-71.3644,42.225],
    bbox: [-128.2,24.6,-59.6,50.7], //USA
    numworkers: 32
})
.on('reduce', function(res){

})
.on('end', function(){
  console.warn("Done...probably still writing buffer to disk?");
})
