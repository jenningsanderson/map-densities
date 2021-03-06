// var fs   = require('fs')
// var _    = require('lodash');
var turf = require("@turf/turf");
var tilebelt = require("@mapbox/tilebelt");
var count = require('turf-count')
var tileCover = require("@mapbox/tile-cover");


module.exports = function(data, tile, writeData, done) {

  // Extract the osm layer from the osm-qa-tile
  var layer = data.osm.osm;

  //z15 grid
  var grid = tileCover.geojson(tilebelt.tileToGeoJSON(tile), {min_zoom:15,max_zoom:15});

  turf.featureEach(grid, function(f){
  	f.properties.area = turf.area(f)
  })

  var points = []
  layer.features.forEach(function(f){
  	var pointCollection = turf.explode(f)
  	pointCollection.features.forEach(function(p){
  	  points.push(p)
  	})
  })

  var pInP = count( grid, 
					  	{ 'type':"FeatureCollection",
					  	  'features':points }, 
  	                    'count')

  turf.featureEach(pInP,function(f){
  	if (f.properties.count > 0){
  		f.properties['n_count'] = f.properties.count / (f.properties.area / 1000000)
  		coords = turf.toMercator(turf.center(f)).geometry.coordinates
  		coords.push(f.properties.count)
  		coords.push(Math.round(f.properties.n_count))
  		writeData(coords.join(",") + "\n")
    }
  })

  done(null, null)
};

