window.nyc = window.nyc || {};



nyc.Locate = (function(){
	/**
	 * @constructor
	 * @param {OpenLayers.Map} map
	 */
	var locateClass = function(map, controls){	
		var me = this;
		
		me.EPSG_2263 = new Proj4js.Proj("EPSG:2263");
		me.EPSG_4326 = new Proj4js.Proj("EPSG:4326");
		me.map = map;
		me.controls = controls;
		
		me.geolocate = new OpenLayers.Control.Geolocate({
		    bind: false,
		    geolocationOptions: {
		        enableHighAccuracy: true,
		        maximumAge: 0,
		        timeout: 7000
		    }
		});
		
		me.locationLyr = new OpenLayers.Layer.Vector("locationLyr", {styleMap: LOCATION_STYLE_MAP});
		map.addControl(me.geolocate);
		map.addLayer(me.locationLyr);
		me.geolocate.events.register("locationupdated", me, me.updated);

		$(controls).on("search", function(e, input){
			me.search(input);
		});
		$(controls).on("disambiguated", function(e, feature){
			me.mapLocation(feature);
			$(me).trigger("found", {type: "feature", feature: feature});				
		});
	};
	
	locateClass.prototype = {
		highlight: function(on){
			if (this.locationLyr.features){
				var f = this.locationLyr.features[0];
				f.renderIntent = on ? "select" : "default";
			    f.layer.drawFeature(f);
			}
		},
		parseGeoClientResp: function(result, disambiguating){
			var typ = result.request.split(" ")[0], resp = result.response, ln1, point; 
			if (typ == "intersection"){
				ln1 = resp.streetName1 + " " + resp.streetName2;
				point = new OpenLayers.Geometry.Point(resp.xCoordinate, resp.yCoordinate); 
			}else if (typ == "blockface"){
				ln1 = resp.firstStreetNameNormalized + " btwn " + resp.secondStreetNameNormalized + " & " + resp.thirdStreetNameNormalized;
				point = new OpenLayers.Geometry.Point(((resp.fromXCoordinate * 1) + (resp.toXCoordinate * 1)) / 2, ((resp.fromYCoordinate * 1) + (resp.toYCoordinate * 1)) / 2); 
			}else{//address, bbl, bin, place
				var x = resp.internalLabelXCoordinate, y = resp.internalLabelYCoordinate;
				ln1 = (resp.houseNumber ? (resp.houseNumber + " ") : "") + resp.firstStreetNameNormalized;
				point = new OpenLayers.Geometry.Point(x && y ? x : resp.xCoordinate, x && y ? y : resp.yCoordinate); 
			}
			var feature = new OpenLayers.Feature.Vector(
				point, 
				{name: this.capitalize(ln1 + ", " + resp.firstBoroughName) + ", NY " + (resp.zipCode || resp.leftSegmentZipCode)}
			);
			if (!disambiguating){
				this.mapLocation(feature);
				this.controls.val(feature.attributes.name);
				$(this).trigger("found", {type: "geoclient", feature: feature});				
			}
			return feature;
		},
		capitalize: function(s){
			var words = s.split(" "), result = "";
			$.each(words, function(i, w){
				var word = w.toLowerCase();
				result += word.substr(0, 1).toUpperCase();
				result += word.substr(1).toLowerCase();
				result += " ";
			});
			return result.trim();
		},
		mapLocation: function(feature){
			var map = this.map, 
				lyr = this.locationLyr, 
				point = feature.geometry, 
				add = function(){
					lyr.removeAllFeatures();
					lyr.addFeatures([feature]);
					this.events.unregister("moveend", this, add);
				};
			this.map.events.register("moveend", map, add);
			this.map.setCenter(new OpenLayers.LonLat(point.x, point.y), LOCATE_ZOOM_LEVEL);				
			this.map.setLayerIndex(lyr, LOCATION_LAYER_IDX);
		},
		search: function(input){
			if (input.length == 5 && !isNaN(input)){
				me.mapZip(ZIP_CODES[input], "ZIP Code: " + input);
			}else if (input.length){
				var me = this;
				input = input.replace(/"/g, "").replace(/'/g, "").replace(/&/g, " and ");
				$.ajax({
					url: GEOCLIENT_URL + input,
					dataType:"jsonp",
					success: function(response) {
						me.geoClientFound(response);
					}
				});
			}
		},
		mapZip: function(point, name){
			if (point){
				var feature = new OpenLayers.Feature.Vector(
					new OpenLayers.Geometry.Point(point[0], point[1]), 
					{name: name}
				);
				this.mapLocation(feature);
				$(this).trigger("found", {type: "zip", feature: feature});
			}else{
				$(this).trigger("fail", "The location you entered was not understood.");
			}			
		},
		geoClientFound: function(response){
			var me = this, results = response.results, lyr = me.locationLyr;
		    this.geolocate.deactivate();
			if (response.status == "OK"){
				var exact = false;
				$.each(results, function(_, result){
					if (result.status == "EXACT_MATCH"){
						me.parseGeoClientResp(result);
						exact = true;
						return;
					}
				});
				if (!exact){
					if (results.length == 1){
						var result = results[0];
						if (result.status = "POSSIBLE_MATCH"){
							lyr.removeAllFeatures();
							me.parseGeoClientResp(result);
						}
					}else{
						me.ambiguous(results);
					}
				}
				$("#address").blur();
			}else{
				$(this).trigger("fail", "The location you entered was not understood.");
			}
		},
		ambiguous: function(results){
			var me = this, possible = [];
			$.each(results, function(i, res){
				if (res.status = "POSSIBLE_MATCH"){
					possible.push(me.parseGeoClientResp(res, true));
				}
			});
			this.controls.disambiguate(possible);			
		},
		locate: function(){
			this.locationLyr.removeAllFeatures();
		    this.geolocate.deactivate();
		    this.geolocate.watch = false;
		    this.geolocate.activate();
		},
		updated: function(e) {
			var epsg2263 = new Proj4js.Point(e.point.x, e.point.y), 
				epsg4326 = Proj4js.transform(this.EPSG_2263, this.EPSG_4326, epsg2263),
				name = epsg4326.y.toFixed(6) + ", " + epsg4326.x.toFixed(6),
				feature = new OpenLayers.Feature.Vector(e.point, {name: name});
		    if (NYC_EXT.contains(e.point.x, e.point.y)){
			    this.mapLocation(feature);
				$(this).trigger("found", {type: "geoclocation", feature: feature});
		    }
		}
	};
	
	return locateClass;
}());
