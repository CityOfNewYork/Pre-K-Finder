window.nyc = window.nyc || {};

window.nyc.UpkDecorator = {
	name: function(){
		return this.attributes.NAME;
	},
	note: function(){
		return this.attributes.NOTE; //TODO modify schema
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
	},
	isFullDay: function(){
		return this.dayLength() == 1 || this.dayLength() == 2;
	}
};

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
		sorted: function(p){
			var me = this, result = [];
			for (var id in this.filteredFeatures){
				result.push(this.filteredFeatures[id]);
			}
			if (p){
				$.each(result, function(_, f){
					f.distance = me.distance(p, f.geometry);
				});
				result.sort(function(a, b){
					if (a.distance < b.distance) return -1;
					if (a.distance > b.distance) return 1;
					return 0;
				});				
			}
			return result;
		},
		features: function(p){
			return this.sorted(p);
		},
		populate: function(features){
			var me = this, decorator = window.nyc.UpkDecorator;
			me.allFeatures = [];
			me.filteredFeatures = {};
			$.each(features, function(_, f){
				for (var decoration in decorator){
					f[decoration] = decorator[decoration];
				}
				me.allFeatures.push(f);
				me.filteredFeatures[f.id] = f;
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