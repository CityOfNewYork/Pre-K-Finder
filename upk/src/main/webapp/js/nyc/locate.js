window.nyc = window.nyc || {};



nyc.Locate = (function(){
	/*
	 * nyc.Locate an object for geocoding and geolocating
	 * @constructor
	 * 
	 * @param {OpenLayers.Map} map
	 * 
	 */
	var locateClass = function(map){	
		var me = this;
		
		me.EPSG_2263 = new Proj4js.Proj("EPSG:2263");
		me.EPSG_4326 = new Proj4js.Proj("EPSG:4326");
		me.map = map;
		me.currentLocation = {};
		me.locFail = false;
		me.searchOpen = false;
		me.showInfo = false;
		me.resizeInterval = null;
		
		me.geolocate = new OpenLayers.Control.Geolocate({
		    bind: false,
		    geolocationOptions: {
		        enableHighAccuracy: false,
		        maximumAge: 0,
		        timeout: 7000
		    }
		});
		
		me.locationLyr = new OpenLayers.Layer.Vector("locationLyr", {styleMap: LOCATION_STYLE_MAP});
		map.addControl(me.geolocate);
		map.addLayer(me.locationLyr);
		me.geolocate.events.register("locationupdated", me, me.updated);
		me.geolocate.events.register("locationfailed", me, function(e) {
			if (e.error.PERMISSION_DENIED){
				if (!me.locFail) 
					$(nyc).trigger("locate.fail", "You have disabled your GPS for the site");
			}else{
				if (!me.locFail) 
					$(nyc).trigger("locate.fail", "Location detection failed");
				me.locFail = true;				
			}
		});
		me.geolocate.events.register("locationuncapable", me, function() {
			if (!me.locFail) 
				$(nyc).trigger("locate.fail", "GPS is not supported by your device");
			me.locFail = true;
		});
		$("#address").keypress(function(e){
			if (e.keyCode == 13) me.search();
		});
		$("#address").dblclick(function(e){
			return false;
		});
		$("#address").focus(function(){
			$("#address").parent().addClass("active");
		});
		$("#address").blur(function(){
			$("#address").parent().removeClass("active");
		});
		
		var searching = false;
		try{//parse query string and geocode
			var params = document.location.search.substr(1).split("&");
			for (var i = 0; i < params.length; i++){
				var p = params[i].split("=");
				if (p[0] == "input"){
					$("#address").val(decodeURIComponent(p[1]).replace(/\s+/g, " "));
					me.search();
					searching = true;
				}
			}
		}catch(ignore){}
		if (!searching) me.locate();
	};
	
	locateClass.prototype = {
		highlight: function(on){
			if (this.locationLyr.features){
				var f = this.locationLyr.features[0];
				f.renderIntent = on ? "select" : "default";
			    f.layer.drawFeature(f);
			}
		},
		parseGeoClientResp: function(result){
			var typ = result.request.split(" ")[0], r = result.response, ln1, p; 
			if (typ == "intersection"){
				ln1 = r.streetName1 + " " + r.streetName2;
				p = new OpenLayers.Geometry.Point(r.xCoordinate, r.yCoordinate); 
			}else if (typ == "blockface"){
				ln1 = r.firstStreetNameNormalized + " btwn " + r.secondStreetNameNormalized + " & " + r.thirdStreetNameNormalized;
				p = new OpenLayers.Geometry.Point(((r.fromXCoordinate * 1) + (r.toXCoordinate * 1)) / 2, ((r.fromYCoordinate * 1) + (r.toYCoordinate * 1)) / 2); 
			}else{//address, bbl, bin, place
				var x = r.internalLabelXCoordinate, y = r.internalLabelYCoordinate;
				ln1 = (r.houseNumber ? (r.houseNumber + " ") : "") + r.firstStreetNameNormalized;
				p = new OpenLayers.Geometry.Point(x && y ? x : r.xCoordinate, x && y ? y : r.yCoordinate); 
			}
			return{
				type:typ,
				point:p,
				title: this.capitalize(ln1 + ", " + r.firstBoroughName) + ", NY " + (r.zipCode || r.leftSegmentZipCode)
			};
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
		mapLocation: function(location, zoom){
			var map = this.map, lyr = this.locationLyr, p = location.point, feats;
			if (!location.title){
				var epsg2263 = new Proj4js.Point(p.x, p.y), epsg4326 = Proj4js.transform(this.EPSG_2263, this.EPSG_4326, epsg2263);
				location.title = epsg4326.y.toFixed(6) + ", " + epsg4326.x.toFixed(6);
				$("#address").val("");
			}else{
				$("#address").val(location.title.replace(/\s+/g, " "));
			}
			
			feats = [new OpenLayers.Feature.Vector(p, {title:location.title})];
		    this.currentLocation = location;
			if (zoom){
				var add = function(){
					lyr.removeAllFeatures();
					lyr.addFeatures(feats);
					this.events.unregister("moveend", this, add);
				};
				this.map.events.register("moveend", map, add);
				this.map.setCenter(new OpenLayers.LonLat(p.x, p.y), LOCATE_ZOOM_LEVEL);				
			}else{
				lyr.removeAllFeatures();
				lyr.addFeatures(feats);
			}
			this.map.setLayerIndex(lyr, LOCATION_LAYER_IDX);
			$(nyc).trigger("locate.found", feats[0]);
		},
		search: function(e){
			var me = this, input = $("#address").val().trim();
			if (input.length == 5 && !isNaN(input)){
				me.mapZip(ZIP_CODES[input], "ZIP Code: " + input);
			}else if (input.length){
				var host = document.location.hostname, protocol = document.location.protocol;
				if (host == "localhost") host = DEV_HOST;
				input = input.replace(/"/g, "").replace(/'/g, "").replace(/&/g, " and ");
				$.ajax({
					url: protocol + "//" + host + GEOCLIENT_URL + input,
					dataType:"jsonp",
					success: function(response) {
						me.geoClientFound(response);
					}
				});
			}
		},
		mapZip: function(p, title){
			if (p){
				this.mapLocation({point:new OpenLayers.Geometry.Point(p[0], p[1]), title:title}, true);
			}else{
				$(nyc).trigger("locate.fail", "The location you entered was not understood.");
			}			
		},
		geoClientFound: function(response){
			var me = this, results = response.results, lyr = me.locationLyr;
		    this.geolocate.deactivate();
			if (response.status == "OK"){
				var exact = false;
				$.each(results, function(_, result){
					if (result.status == "EXACT_MATCH"){
						me.mapGeoClientResp(result);
						exact = true;
						return;
					}
				});
				if (!exact){
					if (results.length == 1){
						var result = results[0];
						if (result.status = "POSSIBLE_MATCH"){
							lyr.removeAllFeatures();
							me.mapGeoClientResp(result);
						}
					}else{
						me.showPossible(results);
					}
				}
				$("#address").blur();
			}else{
				$(nyc).trigger("locate.fail", "The location you entered was not understood.");
			}
		},
		showPossible: function(results){
			var me = this;
			me.possible = results;
			$("#possible").empty();
			$.each(me.possible, function(i, r){
				if (r.status = "POSSIBLE_MATCH"){
					$("#possible").append(
						"<div onclick='nyc.app.locate.mapGeoClientResp(" + i + ");'>" + 
						me.parseGeoClientResp(r).title + "</div>"
					);
				}
			});
			$("#possibleMenu").slideDown(500, me.menuSize);			
		},
		mapGeoClientResp: function(result){
			var r = isNaN(result) ? result : this.possible[result];
			if (!isNaN(result)){//mapping from possible menu
				$("#possibleMenu").slideUp(500);
			}
			var location = this.parseGeoClientResp(r);
			this.mapLocation(location, true);
		},
		locate: function(){
			this.locationLyr.removeAllFeatures();
		    this.geolocate.deactivate();
		    this.geolocate.watch = false;
		    this.geolocate.activate();
		},
		updated: function(e) {
			var me = this, p = new OpenLayers.Geometry.Point(e.point.x, e.point.y);
		    if (!NYC_EXT.contains(p.x, p.y)){
		    	$(nyc).trigger("locate.fail", "Your location is not in the vicinity of NYC");
		    	me.locFail = true;    	
		    }else{
			    me.mapLocation({point:p}, true);
		    }
		}
	};
	
	return locateClass;
}());
