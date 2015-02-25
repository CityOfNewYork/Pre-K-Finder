window.nyc = window.nyc || {};

OpenLayers.Util.DOTS_PER_INCH = 96.0;
OpenLayers.Util.onImageLoadErrorColor = "transparent";		
if (document.domain == "maps.nyc.gov") document.domain = "nyc.gov"; /* allow us to manipulate feedback form document */

nyc.App = (function(){	
	/*
	 * nyc.App 
	 * @constructor
	 * 
	 * @param {OpenLayers.Map} map
	 * @param {nyc.Locate} locate
	 * @param {nyc.UpkList} upkList
	 * @param {nyc.UpkTable} upkTable
	 * 
	 */
	var appClass = function(map, locate, upkList, upkTable){
		var me = this;
		me.po = null;
		me.currentLocation = {geometry:null, attributes:{title:""}};
		me.map = map;
		me.locate = locate;
		me.upkList = upkList;
		me.upkTable = upkTable;
		me.ios = navigator.userAgent.match(/(iPad|iPhone|iPod|iOS)/g) ? true : false;
		me.initPages();
		
		if (me.ios) $("body").addClass("ios");		
		$("#panel").panel({
			  close: function(e, ui){
				  me.toggle({target:$("#toggleToMap")[0]});
			  }
		});
		$("#panel").panel("open");
		$("#upkTypes a, #upkTypes img, #dayLengths a").click($.proxy(me.filter, me));
		$("#toggles").click(me.toggle);
		$(nyc).on("locate.fail", function(_, msg){me.alert(msg);});
		
		me.map.zoomToExtent(NYC_EXT);			
		me.map.events.register("featureover", map, me.hover);
		me.map.events.register("featureout", map, me.out);
		
		$(window).resize(function(){
			me.map.render(map.div);
		});
		
		$('#alert').click(function(){
			$('#alert').fadeOut();
		});
					
		$(nyc).on("locate.found", function(_, f){
			me.currentLocation = f;
			var i = setInterval(function(){
				if (me.upkList.ready){
					me.upkTable.render(me.upkList, f);		
					me.upkInView();
					clearInterval(i);
				}
			}, 200);
			$("#callout").remove();
			$("#alert").fadeOut();
			me.pop = null;
		});
		
		$.ajax({
			url:"upk.json",
			dataType: "json",
			success: function(data){
				if (!data.features){
					this.error();
					return;
				}
				me.upkLayer = new OpenLayers.Layer.Vector("", {
					styleMap: UPK_STYLE_MAP,
					maxResolution: RESOLUTIONS[3],
					/* 
					 * 
					 * for some reason links inside of the identify popup do not  
					 * work on iphone unless renderer is Canvas, but feature  
					 * clicks do not work well on pc if renderer is Canvas 
					 * 
					 */
					renderers: (function(){
						if (me.ios) return ["Canvas", "SVG", "VML"];
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
				me.upkList.populate(data.features);
				me.upkList.filter({dayLength:["1", "2"], type:["DOE", "CBECC"]});
				me.upkLayer.addFeatures(me.upkList.features());
				me.upkTable.render(me.upkList);				
			},
			error: function(){
				$("body").removeClass("firstLoad");
				me.alert("There was an error loading the Pre-K sites.  Please Try again."); 
				}
			});	
		};
		
		appClass.prototype = {
			initPages: function(){
				var me = this, change = function(e, ui){
						if (this.ios){
							$('html').css({
								height: ui.toPage.attr('id') == 'external-page' ? '10000000px' : '100%',
								'overflow-y': 'scroll'
							});
						}else{
							$('#external-page iframe').height($(window).height() - $('.banner').height());
						}
						if (ui.toPage.attr('id') == 'map-page' && me.openPanel){
							$('#toggle-list').trigger('click');
						}
					};
				$('body').pagecontainer({change: change});
			},
			isPanelOpen: function(){
				return $('#toggle .ui-btn-active').attr('id') == 'toggleToList';
			},
			direct: function(from, to, name){
				var me = this;
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
			changePage: function(url){
				this.openPanel = this.isPanelOpen();
				$('#external-page iframe').attr('src', url);
				$('body').pagecontainer('change', $('#external-page'), {transition: 'slideup'});
			},
			more: function(){
				this.upkTable.more();
			},
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
			alert: function(msg){
				$("#msg").html(msg);
				$("body").append($("#alert"));
				$("#alert").fadeIn(400, function(){
					$("#alert input").focus();				
				});
			},
			search: function(){
				var me = this,
					width = $("#search").width() > 1 ? 1 : $("#_search").width(),
					left = width == 1 ? $("#search").position().left : $("#_srch").position().left;					
				$("#search").css("visibility", "visible");
				$("#search").animate({width:width},
					function(){
						if (width == 1){
							me.locate.search();
							$("#search").css("visibility", "hidden");
						}else{
							$("#address").focus();
							$("#address").select();
						}
					}
				);
				$("#srch").animate({left:left});
			},
			centerUpk: function(id){
				var me = this, upk = me.upkList.upk(id), g = upk.geometry;
				me.map.setCenter(new OpenLayers.LonLat(g.x, g.y), 8);
				upk.upkFeature.renderIntent = "select";
				$("#toggleToMap").trigger("click");
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
			hover: function(e){
			    var f = e.feature;
			    if (f){
				    f.renderIntent = "select";
				    f.layer.drawFeature(f);
			    }
			}, 
			out: function(e){
				var f = e.feature;
			    if (f){
			    	f.renderIntent = "default";
			    	f.layer.drawFeature(f);
			    }
			},
			toggle: function(e){
				var target = $(e.target);
				$("#toggles .ui-btn").removeClass("ui-btn-active");
				$("#panel").panel(target.html() == "Map" ? "close" : "open");
				setTimeout(function(){target.addClass("ui-btn-active");}, 100);
			},
			filter: function(e){
				var me = this, target = $(e.target);
				if (!target.data("filter-name")) target = target.parent(); /* user clicked on the hand icon */
				target.parent().children().removeClass("ui-btn-active");
				target.addClass("ui-btn-active");
				setTimeout(function(){ /* timeout allows applied css to rerender before more expensive filtering and table rendering */
					var filters = {type:[], dayLength:[]};
					$.each($("#upkTypes .ui-btn-active, #dayLengths .ui-btn-active"), function(_, n){
						var name = $(n).data("filter-name"), values = $(n).data("filter-values");
						values = filters[name].concat(values.split(","));
						filters[name] = values;
					});
					me.upkList.filter(filters);
					me.upkTable.render(me.upkList, me.currentLocation);
					me.upkLayer.removeAllFeatures();
					me.upkLayer.addFeatures(me.upkList.features());
					$("#callout").remove();
					me.upkLayer.redraw();
				}, 2);
			},
			zoom: function(by){
				var map = this.map;
				map.zoomTo(map.getZoom() + by);
			},
			removeCallout: function(){
				var f = this.upkList.upk(this.pop._f.id).upkFeature;
				$("#callout").remove();
				f.renderIntent = "default";
			    this.pop = null;
			    /* if we don't do 3 lines below you can't identify same feature after closing popup - why? - dunno */
				this.upkLayer.removeFeatures([f]);
				this.upkLayer.addFeatures([f]);
				$(this.upkLayer.div).trigger("click");
			},
			identify:function(f){
				var me = this,
					g = f.geometry, 
					p = new OpenLayers.LonLat(g.x, g.y), 
					upk = me.upkList.upk(f.id),
					loc = me.currentLocation,
					html = new nyc.UpkInfo(upk, loc).render("callout");
			    if (me.pop) me.removeCallout();
				me.pop = new OpenLayers.Popup.FramedCloud("callout", p, null, html, null, true, function(){me.removeCallout();});
				me.pop._f = f;
				me.pop.panMapIfOutOfView = true;
				me.map.addPopup(me.pop);
		    	$(me.pop.closeDiv).removeClass("olPopupCloseBox");
		    	$(me.pop.closeDiv).addClass("ui-icon-delete");
		    	$(me.pop.closeDiv).css({width:"24px", height:"24px"});
		    	$(nyc).trigger("app.identify");
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

	nyc.app = new nyc.App(map, new nyc.Locate(map), new nyc.UpkList(), new nyc.UpkTable()); 
	
	if (DO_APPLY){
		$("#splash .info").html(MORE_INFO_TITLE);
	}else{
		$("#splash .apply").hide();
		$("#splash .info").html(INFO_TITLE);
	}
	$("#main").append($("#splash"));
	$("#splash").fadeIn();
	$("#copyright").html("&copy; " + new Date().getFullYear() + " City of New York");
	$(".schoolYr").html("for School Year " + SCHOOL_YEAR);
});