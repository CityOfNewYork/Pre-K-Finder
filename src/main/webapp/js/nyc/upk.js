/** @export */
window.nyc = window.nyc || {};
/** @export */
nyc.upk = nyc.upk || {};

/** @export */
nyc.upk.FieldsDecorator = {
	locCode: function(){
		return this.attributes.LOCCODE;
	},
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
		return $.inArray(this.dayLength() * 1, FULL_DAY) > -1;
	},
	showApply: function(){
		return !GET_IN_TOUCH_ONLY && this.attributes.BUTTON_TYPE == "apply";
	}
};

/** 
 * Field decorator for HTML rendering of a Pre-K Program geoJSON object
 * @export
 */
nyc.upk.HtmlDecorator = {
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	codeHtml: function(){
		var codeHtml =  $("<div class='code'><span class='name'>Program Code: </span></div>");
		return codeHtml.append(this.code());
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	nameHtml: function(){
		var nameHtml = $("<div class='name notranslate' translate='no'></div>"),
			iconHtml = $("<img class='type-icon'>");		
		iconHtml.attr("src", "img/" + this.type() + "0.png");
		nameHtml.append(iconHtml);
		return nameHtml.append(this.name());
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	noteHtml: function(){
		var noteHtml = $("<div class='note'></div>");		
		return noteHtml.html(this.note());
	},
	/** 
	 * @private 
	 * @return {Array<jQuery>}
	 */
	addrHtml: function(){
		var addr1Html = $("<div class='addr notranslate' translate='no'></div>"),
			addr2Html = $("<div class='addr notranslate' translate='no'></div>");		
		addr1Html.append(this.address1());
		addr2Html.append(this.address2());
		return [addr1Html, addr2Html];
	},
	/** @private */
	targetAttr: function(field, elem){
		if (IOS || (field == "web")) elem.attr("target", "_blank");
	},
	/** 
	 * @private 
	 * @return {jQuery|string}
	 */
	linkHtml: function(field, hrefPrefix){
		var value = this[field]().trim();
		if (value){
			var linkHtml = $("<div class='notranslate' translate='no'></div>"),
				href= $("<a></a>"),
				text = value;
			if (field == "web"){
				text = text.substr(text.indexOf(":") + 3);
			}
			href.append(text);
			href.attr("href", hrefPrefix + encodeURI(value));
			this.targetAttr(field, href);
			linkHtml.append(href);
			return linkHtml.addClass(field);
		}
		return "";
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	phoneHtml: function(){
		return this.linkHtml("phone", "tel:");
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	emailHtml: function(){
		return this.linkHtml("email", "mailto:");
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	webHtml: function(){
		return this.linkHtml("web", "");
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	programFeatureHtml: function(field, msgMap){
		var programFeatureHtml = $("<li></li>");
		return programFeatureHtml.append(msgMap[this[field]()]);
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	programFeaturesHtml: function(){
		var programFeaturesHtml = $("<div class='name'>Program Features:</div>"),
			featureList = $("<ul class='feats'></ul>");
		featureList.append(this.programFeatureHtml("meal", MEAL))
			.append(this.programFeatureHtml("inout", IN_OUT))
			.append(this.programFeatureHtml("extend", EXTEND));
		return [programFeaturesHtml, featureList];
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	seatsDayHtml: function(){
		var seatsDayHtml = $("<div class='seats'></div>"),
			yrHtml = $("<span class='name'></span>");
		yrHtml.append(window.SCHOOL_YEAR + " Seats: ");
		return seatsDayHtml.append(yrHtml)
			.append(this.seats() + " " + DAY_LENGTH[this.dayLength()]);
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	detailHtml: function(){
		var detailHtml = $("<div class='upk-detail'></div>");
		return detailHtml.append(this.codeHtml())
			.append(this.emailHtml())
			.append(this.webHtml())
			.append(this.programFeaturesHtml())
			.append(this.seatsDayHtml());
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	directionsBtnHtml: function(){
		var directionsBtnHtml = $("<div class='directions'></div>"),
			anchorHtml = $("<a class='ui-btn'>Directions</a>");
		anchorHtml.attr("data-upk-addr", this.address());
		anchorHtml.attr("data-upk-name", this.name());
		anchorHtml.attr("onclick", "nyc.app.direct(this, nyc.app);");
		return directionsBtnHtml.append(anchorHtml);
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	mapBtnHtml: function(infoId){
		var mapBtnHtml = $("<div class='map'></div>"),
			anchorHtml = $("<a class='ui-btn'>Map</a>");
		anchorHtml.attr("onclick", "nyc.app.mapUpk('" + this.id + "', nyc.app);");
		return mapBtnHtml.append(anchorHtml);
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	detailBtnHtml: function(infoId){
		var detailBtnHtml = $("<div class='detail'></div>"),
			anchorHtml = $("<a class='ui-btn'>Details</a>");
		anchorHtml.attr("onclick", "nyc.app.showUpkDetail('" + infoId + "', nyc.app);");
		return detailBtnHtml.append(anchorHtml);
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	infoApplyBtnHtml: function(){
		var infoApplyBtnHtml = $("<div class='apply'></div>"),
			anchorHtml = $("<a class='ui-btn'></a>"), 
			url, title;
		if (this.showApply()){
			url = APPLY_URL;
			title = APPLY_TITLE;
			anchorHtml.attr("href", url)
				.attr("target", "_blank");
		}else{
			url = INFO_URL;
			title = SPLASH_INFO_BUTTON_TITLE_NO_APPLY;
			anchorHtml.attr("data-url", url)
				.attr("onclick", "nyc.app.changePage(this, nyc.app);");
		}
		anchorHtml.html(title);
		return infoApplyBtnHtml.append(anchorHtml);		
	},
	/** 
	 * @private 
	 * @return {jQuery}
	 */
	buttonsHtml: function(infoId){
		var buttonsHtml = $("<div class='upk-action'></div>");
		return buttonsHtml.append(this.directionsBtnHtml())
			.append(this.mapBtnHtml())
			.append(this.infoApplyBtnHtml())
			.append(this.detailBtnHtml(infoId));
	},
	/** 
	 * @export 
	 * @return {jQuery}
	 */
	html: function(infoClass){
		var html = $("<div class='" + infoClass + " upk-info'>"), infoId = infoClass + this.id;
		html.attr("id", infoId);
		return html.append(this.nameHtml())
			.append(this.noteHtml())
			.append(this.addrHtml())
			.append(this.phoneHtml())
			.append(this.detailHtml())
			.append(this.buttonsHtml(infoId));
	}
};

/** @export */
nyc.upk.List = (function(){
	/**  @constructor */
	var upkListClass = function(){
		this.ready = false;
		this.allFeatures = [];
		this.filteredFeatures = {};
	};
	upkListClass.prototype = {
		/**
		 * @export
		 * @param {Object} filters
		 */
		filter: function(filters){
			var me = this;
			me.filteredFeatures = {};
			$.each(me.allFeatures, function(_, upk){
				var type = filters.type,
				dayLength = filters.dayLength,
				applyOnly = filters.applyOnly.length;
				if ($.inArray(upk.type() + "", type) > -1 && $.inArray(upk.dayLength() + "", dayLength) > -1){
					if (!applyOnly || upk.showApply()){
						me.filteredFeatures[upk.id] = upk;
					}
				}
			});
		},
		/**
		 * @export
		 * @param {OpenLayers.Geometry.Point} point
		 */
		sorted: function(point){
			var me = this, sortedFeatures = [];
			for (var id in this.filteredFeatures){
				sortedFeatures.push(this.filteredFeatures[id]);
			}
			if (point){
				$.each(sortedFeatures, function(_, feature){
					feature.distance = me.distance(point, feature.geometry);
				});
				sortedFeatures.sort(function(feature1, feature2){
					if (feature1.distance < feature2.distance) return -1;
					if (feature1.distance > feature2.distance) return 1;
					return 0;
				});				
			}
			return sortedFeatures;
		},
		/**
		 * @export
		 * @param {OpenLayers.Geometry.Point} point
		 */
		features: function(point){
			return this.sorted(point);
		},
		/**
		 * @export
		 * @param {OpenLayers.Geometry.Point} point
		 */
		populate: function(features){
			var me = this, decorators = [nyc.upk.FieldsDecorator, nyc.upk.HtmlDecorator];
			me.allFeatures = [];
			me.filteredFeatures = {};
			$.each(features, function(_, feature){
				$.each(decorators, function(_, decorator){
					for (var decoration in decorator){
						feature[decoration] = decorator[decoration];
					}
				});
				me.allFeatures.push(feature);
				me.filteredFeatures[feature.id] = feature;
			});
			this.ready = true;
		},
		/**
		 * @export
		 * @param {string} id
		 */
		feature: function(id){
			var upk = null;
			$.each(this.filteredFeatures, function(_, feature){
				if (feature.id == id){
					upk = feature;
					return;
				}
			});
			return upk;
		},
		distance: function(point1, point2){
			var dx = point1.x - point2.x, 
				dy = point1.y - point2.y;
			return Math.sqrt(dx*dx + dy*dy)/5280;
		}
	};
	return upkListClass;
}());

nyc.upk.ListRenderer = (function(){
	/** @constructor */
	var upkTableClass = function(){
		$(window).on("orientationchange resize", this.adjContainerHeight);
		this.upkList = null;
		this.currentLocation = {geometry: null, attributes: {}};
		$("#list-more").click($.proxy(this.more, this));
	};
	upkTableClass.prototype = {
		/**
		 * @export
		 * @param {OpenLayers.Feature.Vector} feature
		 */
		render: function(upkList, currentLocation){
			var tbl = $("#list-table");
			this.upkList = upkList;
			this.currentLocation = currentLocation || this.currentLocation;
			tbl.html("<tbody></tbody>");
			$("#list-more").data("current-pg", "0");
			this.rows(tbl[0], 0);
		},
		/** @private */
		rows: function(tbl, pg){
			var start = pg * 10, end = start + 10, upks = this.upkList.features(this.currentLocation.geometry);
			if (end >= upks.length){
				end = upks.length;
				$("#list-pager").hide();
			}else{
				$("#list-pager").show();
			}
			for (var i = start; i < end; i++){
				var upk = upks[i], 
					tr0 = tbl.insertRow(i), 
					td0 = tr0.insertCell(0), 
					td1 = tr0.insertCell(1);
				tr0.id = "table" + upk.id;
				tr0.className = upk.type();
				if (i % 2 == 0) $(tr0).addClass("odd-row");
				td0.className = "distCell";
				td1.className = "upkCell";
				td1.id = upk.id;
				if (upk.distance != null){
					$(td0).html(upk.distance.toFixed(2) + " mi");
				}
				$(td1).html(upk.html("table"));
			}
			$.each($(".phone"), function(_, n){
				if (!$(n).html()) $(n).parent().hide();
			});
			$("#list-more").data("current-pg", pg + 1);
			this.adjContainerHeight();
		},
		/** @private */
		adjContainerHeight: function(){
			$("#list-container").height($(window).height() - $(".banner").height() - $("#filter").height() - 15);
		},
		/** @private */
		more: function(){
			this.rows($("#list-table")[0], $("#list-more").data("current-pg") * 1);
		}
	};
	return upkTableClass;
}());
