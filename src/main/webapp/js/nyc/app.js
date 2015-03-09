window.nyc = window.nyc || {};

nyc.App = (function(){	
	/**
	 * nyc.App 
	 * @constructor
	 * 
	 * @param {OpenLayers.Map} map
	 * @param {nyc.Locate} locate
	 * @param {nyc.UpkList} upkList
	 * @param {nyc.UpkTable} upkTable
	 * @param {nyc.Share} share
	 * 
	 */
	var appClass = function(map, locate, upkList, upkTable, share){
		var me = this;
		me.pop = null;
		me.currentLocation = {geometry: null, name: function(){return "";}};
		me.map = map;
		me.locate = locate;
		me.parseQueryStr();
		me.upkList = upkList;
		me.upkTable = upkTable;
		
		me.initPages();

		$(locate).on("found", $.proxy(me.found, me));
		$(locate).on("fail", $.proxy(me.alert, me));
		
		if (IOS) $("body").addClass("ios");		
		$("#panel").panel({
			  close: function(e, ui){
				  me.toggle({target:$(".toggle-map")[0]});
			  }
		});
		
		$("#panel").panel("open");
		$("#filter").collapsible({
			expand: me.upkTable.adjContainerHeight,
			collapse: me.upkTable.adjContainerHeight
		});
		$("#filter input[type=checkbox]").change($.proxy(me.filter, me));
		$("#toggle").click(me.toggle);
		$(share).on('feedback', function(e){me.changePage(FEEDBACK_URL, me);});
		
		me.map.zoomToExtent(NYC_EXT);			
		me.map.events.register("featureover", map, me.hover);
		me.map.events.register("featureout", map, me.out);
		
		$(window).on("orientationchange resize", function(){
			me.map.render(map.div);
		});
		
		$('#alert').click(function(){
			$('#alert').fadeOut();
		});
							
		$.ajax({
			url:"upk.csv",
			dataType: "text",
			success: function(csvData){
				var csvFeatures = $.csv.toObjects(csvData), features = [], wkt = new OpenLayers.Format.WKT();
				$.each(csvFeatures, function(_, f){
					var feature = wkt.read("POINT (" + f.X + " " + f.Y + ")");
					feature.attributes = f;
					features.push(feature);
				});
				me.upkLayer = new OpenLayers.Layer.Vector("", {
					styleMap: UPK_STYLE_MAP,
					maxResolution: RESOLUTIONS[2],
					/* 
					 * 
					 * for some reason links inside of the identify popup do not  
					 * work on iphone unless renderer is Canvas, but feature  
					 * clicks do not work well on pc if renderer is Canvas 
					 * 
					 */
					renderers: (function(){
						if (IOS) return ["Canvas", "SVG", "VML"];
						return ["SVG", "VML", "Canvas"];
					})(),
					eventListeners:{
					    featuresadded: function(){
							$("body").removeClass("firstLoad");
						}
					}
				});
				me.map.addControl(
					new OpenLayers.Control.SelectFeature(me.upkLayer, {
						onSelect: function(f){
							me.identify(f);
						},
						autoActivate: true
					})
				);				
				me.map.addLayer(me.upkLayer);
				me.map.setLayerIndex(me.upkLayer, UPK_LAYER_IDX);
				me.upkList.populate(features);
				me.setUpkSearch(me.upkList.features());
				me.upkLayer.addFeatures(features);
				me.upkTable.render(me.upkList);
				locate.controls.addSources([{name: UPK_SEARCH_BY_CHOICE, source: me.upkList}]);
			},
			error: function(){
				$("body").removeClass("firstLoad");
				me.alert(null, "There was an error loading the Pre-K sites.  Please Try again."); 
				}
			});	
		};

		appClass.prototype = {
			/**
			 * @export
			 * @param {Element} btn
			 * @param {nyc.App} me
			 */
			mapUpk: function(btn, me){
				me.centerUpk($(btn).data("upk-fid"));
			},
			/**
			 * @export
			 * @param {Element} btn
			 * @param {nyc.App} me
			 */
			showUpkDetail: function(btn, me){
				var id = $(btn).data("upk-info-id"), 
					detail = $("#" + id +" .upkDetail"), 
					show = detail.css("display") == "none";
				detail.slideToggle(function(){
					me.updateCallout();
					if (show){
						var upkHtml = $("#" + id),
							upkHeight = upkHtml.height(),
							upkBottom = upkHtml.position().top + upkHeight,
							content = $("#list-container"),
							contentHeight = content.height();
						if (contentHeight > upkHeight && upkBottom > contentHeight){
							content.animate({
								scrollTop: content.scrollTop() + (upkBottom - contentHeight)
							});
						}
					}
				});
			},
			/**
			 * @export
			 * @param {Element} btn
			 * @param {nyc.App} me
			 */
			direct: function(btn, me){
				var to = escape($(btn).data("upk-addr")),
					name = escape($(btn).data("upk-name")),
					from = escape(me.currentLocation && me.currentLocation.name ? me.currentLocation.name() : "");
				me.openPanel = me.isPanelOpen();
				$('body').pagecontainer('change', $('#dir-page'), {transition: 'slideup'});
				if (me.lastDir != from + '|' + to){
					var args = {from: unescape(from), to: unescape(to), facility: unescape(name)};
					me.lastDir = from + '|' + to;
					if (me.directions){
						me.directions.directions(args);
					}else{
						setTimeout(function(){
							me.directions = new nyc.Directions(args, $('#dir-map'));
						}, 500);
					}
				}
			},
			/**
			 * @export
			 * @param {Element|string} btnUrl
			 * @param {nyc.App} me
			 */
			changePage: function(btnUrl, me){
				var url = typeof btnUrl == "string" ? btnUrl : $(btnUrl).data("url");
				me.openPanel = me.isPanelOpen();
				$("#external-page iframe").attr("src", url);
				$("body").pagecontainer("change", $("#external-page"), {transition: "slideup"});
			},
			/** @private */
			initPages: function(){
				var me = this, change = function(e, ui){
						if (IOS){
							$('html').css({
								height: ui.toPage.attr('id') == 'external-page' ? '10000000px' : '100%',
								'overflow-y': 'scroll'
							});
						}else{
							var frameSize = function(){						
								$('#external-page iframe').height($(window).height() - $('.banner').height());
							};
							$(window).on("orientationchange resize", frameSize);
							frameSize();
						}
						if (ui.toPage.attr('id') == 'map-page' && me.openPanel){
							$('#toggle-list').trigger('click');
						}
					};
				$('body').pagecontainer({change: change});
			},
			isPanelOpen: function(){
				return $('#toggle-list').hasClass('ui-btn-active');
			},
			/** @private */
			parseQueryStr: function(){
				var searching = false;
				try{//parse query string and geocode
					var params = document.location.search.substr(1).split("&");
					for (var i = 0; i < params.length; i++){
						var p = params[i].split("=");
						if (p[0] == "input"){
							this.locate.search(decodeURIComponent(p[1]).replace(/\s+/g, " "));
							searching = true;
						}
					}
				}catch(ignore){}
				if (!searching) this.locate.locate();				
			},
			/** @private */
			setUpkSearch: function(features){
				var me = this;
				$.each(features, function(_, f){
					var it = $("<li>" + f.name() + "</li>");
					it.click(function(){
						me.centerUpk(f.id);
						$("input[placeholder='Search schools...']").val(f.name());
					});
					$("#schools").append(it);
				});
			},
			/** @private */
			found: function(_, location){
				var me = this;
				me.currentLocation = location.feature;
				var i = setInterval(function(){
					if (me.upkList.ready){
						me.upkTable.render(me.upkList, location.feature);		
						me.upkInView();
						clearInterval(i);
					}
				}, 200);
				$("#callout").remove();
				$("#alert").fadeOut();
				me.pop = null;
				if (location.type == "feature"){
					me.identify(me.upkList.feature(location.feature.origId));
				}
			},
			/** @private */
			upkInView: function(){
				var features = this.upkList.features(this.currentLocation.geometry);
				if (features.length){
					var e = this.map.getExtent(), 
						g = features[0].geometry, 
						p = new OpenLayers.LonLat(g.x, g.y);
					if (!e.containsLonLat(p)){
						e.extend(p);
						this.map.zoomToExtent(e);
					}
				}
			},
			/** @private */
			filter: function(e){
				var me = this;
				var filters = {type:[], dayLength:[]};
				$.each($("#filter input[type=checkbox]:checked"), function(_, n){
					var name = $(n).data("filter-name"), values = $(n).data("filter-values") + "";
					values = filters[name].concat(values.split(","));
					filters[name] = values;
				});
				me.upkList.filter(filters);
				me.upkTable.render(me.upkList, me.currentLocation);
				me.upkLayer.removeAllFeatures();
				me.upkLayer.addFeatures(me.upkList.features());
				me.setUpkSearch(me.upkList.features());				
				$("#callout").remove();
				me.upkLayer.redraw();
			},
			/** @private */
			alert: function(e, msg){
				$("#alert .alert-msg").html(msg);
				$("body").append($("#alert"));
				$("#alert").fadeIn(400, function(){
					$("#alert input").focus();				
				});
			},
			/** @private */
			centerUpk: function(id){
				var me = this, upk = me.upkList.feature(id), g = upk.geometry;
				me.map.setCenter(new OpenLayers.LonLat(g.x, g.y), 8);
				upk.renderIntent = "select";
				$($(".toggle-map")[0]).trigger("click");
				me.upkLayer.redraw();
		    	if ($(window).height() < 550){
		    		var id = function(){
		    			me.map.events.un({moveend:id});
		    			me.identify(upk);
		    		};
					me.map.events.on({moveend:id});
		    		me.map.pan(100, 100);
		    	}else{
	    			me.identify(upk);
		    	}
			},
			/** @private */
			hover: function(e){
			    var f = e.feature;
			    if (f){
				    f.renderIntent = "select";
				    f.layer.drawFeature(f);
			    }
			}, 
			/** @private */
			out: function(e){
				var f = e.feature;
			    if (f){
			    	f.renderIntent = "default";
			    	f.layer.drawFeature(f);
			    }
			},
			/** @private */
			toggle: function(e){
				var target = $(e.target);
				$("#toggle .ui-btn").removeClass("ui-btn-active");
				$("#panel").panel(target.html() == "Map" ? "close" : "open");
				setTimeout(function(){target.addClass("ui-btn-active");}, 100);
			},
			/** @private */
			removeCallout: function(){
				var f = this.upkList.feature(this.pop.fid);
				$("#callout").remove();
				f.renderIntent = "default";
			    this.pop = null;
			    /* if we don't do 3 lines below you can't identify same feature after closing popup - why? - dunno */
				this.upkLayer.removeFeatures([f]);
				this.upkLayer.addFeatures([f]);
				$(this.upkLayer.div).trigger("click");
			},
			/** @private */
			identify: function(feature){				
				var me = this,
					checker = $("#callout-size-check"),
					div = $("<div></div>").append(feature.html("callout"));
			    if (me.pop) me.removeCallout();
				checker.html(div.html());	
			    me.pop = new OpenLayers.Popup.FramedCloud(
		    		"callout", 
		    		new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y), 
		    		new OpenLayers.Size(checker.width(), checker.height()), 
		    		div.html(), 
		    		null, 
		    		true, 
		    		function(){me.removeCallout();}
	    		);
				me.upkTable.render(me.upkList, feature);		
				me.pop.fid = feature.id;
				me.pop.autoSize = false;
				me.pop.keepInMap = true;
				me.map.addPopup(me.pop);
		    	$(me.pop.closeDiv).removeClass("olPopupCloseBox");
		    	$(me.pop.closeDiv).addClass("ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all");
		    	$(me.pop.closeDiv).css({width:"24px", height:"24px"});
			},
			/** @private */
			updateCallout: function(){
				var pop = this.pop;
				if (pop){
					pop.updateSize();
					pop.panIntoView();
				}
			}
		};
		
		return appClass;
}());

$(document).ready(function(){

	var map = new OpenLayers.Map(
		"map", 
		{
			resolutions: RESOLUTIONS,
			projection: EPSG_2263,
			maxExtent: MAX_EXT,
			units: "ft"
		}
	);
	var base = new OpenLayers.Layer.ArcGISCache(
		"Street Map",
		BASEMAP_URLS,
		{
		    tileOrigin: ORIGIN,
		    resolutions: RESOLUTIONS,
		    tileSize:SIZE,
		    sphericalMercator: false,
		    maxExtent: MAX_EXT,
		    useArcGISServer: false,
		    isBaseLayer: true,
		    type: "jpg",
		    projection: EPSG_2263,
		    hexZoom: true
	});
	
	map.addLayer(base);

	nyc.app = new nyc.App(
		map, 
		new nyc.Locate(map, new nyc.ZoomSearch('#main', map)), 
		new nyc.upk.List(), 
		new nyc.upk.ListRenderer(), 
		new nyc.Share('#main')
	); 

	var changePage = function(url){
		nyc.app.changePage(url);
		$("#splash").fadeOut();
	};
	
	if (DO_APPLY){
		$("#splash .splash-info").html(MORE_INFO_TITLE);
		$("#splash .splash-apply").data("url", APPLY_URL);
	}else{
		$("#splash .splash-apply").hide();
		$("#splash .splash-info").html(INFO_TITLE);
	}
	
	$("#splash .splash-info").data("url", INFO_URL);
	$("body").append($("#splash"));
	$("#splash").fadeIn();
	$("#copyright").html("&copy; " + new Date().getFullYear() + " City of New York");
	$(".banner-school-yr").html("for School Year " + SCHOOL_YEAR);
	
});