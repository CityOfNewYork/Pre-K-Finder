window.nyc = window.nyc || {};
nyc.upk = nyc.upk || {};

nyc.upk.FieldsDecorator = {
	code: function(){
		return this.attributes.SEMS_CODE;
	},
	name: function(){
		return this.attributes.NAME;
	},
	note: function(){
		return this.attributes.NOTE;
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
	email: function(){
		return this.attributes.EMAIL || "";
	},
	web: function(){
		return this.attributes.WEBSITE || "";
	},
	meal: function(){
		return this.attributes.MEALS;
	},
	inout: function(){
		return this.attributes.INDOOR_OUTDOOR;
	},
	extend: function(){
		return this.attributes.EXTENDED_DAY;
	},
	seats: function(){
		return this.attributes.SEATS;
	},
	dayLength: function(){
		return this.attributes.DAY_LENGTH;
	},
	type: function(){
		return this.attributes.PREK_TYPE;
	},
	isFullDay: function(){
		return $.inArray(this.dayLength(), FULL_DAY) > -1;
	}
};

nyc.upk.htmlDecorator = {
	codeHtml: function(){
		var codeHtml =  $("<div class='code'><span class='name'>Program Code: </span></div>");
		return codeHtml.append(upk.code());
	},
	nameHtml: function(){
		var nameHtml = $("<div class='name'></div>"),
			iconHtml = $("<img class='upkType'>");		
		iconHtml.attr("src", "img/" + upk.type() + "0.png");
		nameHtml.append(iconHtml);
		return nameHtml.append(this.name());
	},
	addrHtml: function(){
		var addr1Html = $("<div' class='addr'></div>"),
			addr2Html = $("<div' class='addr'></div>");		
		addr1Html.append(this.address1());
		addr2Html.append(this.address2());
		return [addr1Html, addr2Html];
	},
	targetAttr: function(elem, ios){
		if (ios) elem.attr("target", "_blank");
	},
	linkHtml: function(field, hrefPrefix, ios){
		var linkHtml = $("<div'></div>"),
			href= $("<a></a>");		
		href.append(this.phone());
		href.attr("href", hrefPrefix + encodeURI(this[field]()));
		this.targetAttr(href, ios);
		linkHtml.append(href);
		return linkHtml.addClass(field);
	},
	phoneHtml: function(ios){
		return this.linkHtml("phone", "tel:", ios);
	},
	emailHtml: function(ios){
		return this.linkHtml("email", "mailto:", ios);
	},
	webHtml: function(ios){
		return this.linkHtml("web", "http://", ios);
	},
	programFeatureHtml: function(field, msgMap){
		var programFeatureHtml = $("<li></li>");
		return programFeatureHtml.append(msgMap[this[field]()]);
	},
	programFeaturesHtml: function(){
		var programFeaturesHtml = $("<div class='name'>Program Features:</div>"),
			featureList = $("<ul class='feats'></ul>");
		featureList.append(this.programFeatureHtml("meal", MEAL))
			.append(this.programFeatureHtml("inout", IN_OUT))
			.append(this.programFeatureHtml("extend", EXTEND));
		return [programFeaturesHtml, featureList];
	},
	seatsDayHtml: function(){
		var seatsDayHtml = $("<div class='seats'></div>"),
			yrHtml = $("<span class='name'></span>");
		yrHtml.append(SCHOOL_YEAR + " seats: ");
		return seatsDayHtml.append(yrHtml)
			.append(" " + DAY_LENGTH[upk.dayLength()]);
	},
	detailHtml: function(ios){
		var detailHtml = $("<div class='upkDetail'></div>");
		return detailHtml.append(this.codeHtml())
			.append(this.emailHtml(ios))
			.append(this.webHtml(ios))
			.append(this.programFeaturesHtml())
			.append(this.seatsDayHtml());
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
			var me = this, decorator = nyc.upk.FieldsDecorator;
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