window.nyc = window.nyc || {};

nyc.Upk = (function(){
	/*
	 * nyc.Upk extends a geoJSON Feature with fields and convenience methods
	 * @constructor
	 * 
	 * @param {Object} f
	 * 
	 */
	var upkClass = function(f){
		var c = f.geometry.coordinates,
			pt = new OpenLayers.Geometry.Point(c[0], c[1]),
			attr = f.properties;
		this.upkFeature = new OpenLayers.Feature.Vector(pt, attr);
		this.geometry = this.upkFeature.geometry;
		this.attributes = this.upkFeature.attributes;
		this.id = this.upkFeature.id;
		this.distance = null;
	};
	upkClass.prototype = {
		name: function(){
			return this.attributes.NAME;
		},
		specialMessage: function(){
			return ''; //TODO modify schema
		},
		address1: function(){
			return this.attributes.ADDRESS;
		},
		address2: function(){
			return BOROUGH[this.attributes.BOROUGH] + ", NY " + this.attributes.ZIP;
		},
		address: function(){
			return this.address1() + ", " + this.address2();
		},
		phone: function(){
			return this.attributes.PHONE || "";
		},
		dayLength: function(){
			return this.attributes.DAY_LENGTH;
		},
		seats: function(){
			return this.attributes.SEATS;
		},
		type: function(){
			return this.attributes.PREK_TYPE;
		}
	};
	return upkClass;
}());

nyc.UpkList = (function(){
	/*
	 * nyc.UpkList extends a geoJSON FeatureCollection providing methods to sort by distance from a user's location
	 * @constructor
	 * 
	 */
	var upkListClass = function(){
		this.ready = false;
		this.allFeatures = [];
		this.filteredFeatures = {};
	};
	upkListClass.prototype = {
		filter: function(filters){
			var me = this;
			me.filteredFeatures = {};
			$.each(me.allFeatures, function(_, upk){
				var type = filters.type,
				dayLength = filters.dayLength;
				if ($.inArray(upk.type() + "", type) > -1 && $.inArray(upk.dayLength() + "", dayLength) > -1)
					me.filteredFeatures[upk.id] = upk;
			});
		},
		sorted: function(p, ol){
			var me = this, result = [];
			for (var id in this.filteredFeatures){
				var upk = this.filteredFeatures[id], f = upk.upkFeature;
				f.distance = upk.distance;
				result.push(ol ? f : upk);
			}
			if (p){
				$.each(result, function(_, upk){
					upk.distance = me.distance(p, upk.geometry);
				});
				result.sort(function(a, b){
					if (a.distance < b.distance) return -1;
					if (a.distance > b.distance) return 1;
					return 0;
				});				
			}
			return result;
		},
		upks: function(p){
			return this.sorted(p);
		},
		features: function(p){
			return this.sorted(p, true);
		},
		populate: function(features){
			var me = this;
			me.allFeatures = [];
			me.filteredFeatures = {};
			$.each(features, function(_, f){
				var upk = new nyc.Upk(f);
				me.allFeatures.push(upk);
				me.filteredFeatures[upk.id] = upk;
			});
			this.ready = true;
		},
		upk: function(id){
			var upk = null;
			$.each(this.filteredFeatures, function(_, f){
				if (f.id == id){
					upk = f;
					return;
				}
			});
			return upk;
		},
		distance: function(a, b){
			var dx = a.x - b.x, 
				dy = a.y - b.y;
			return Math.sqrt(dx*dx + dy*dy)/5280;
		}
	};
	return upkListClass;
}());