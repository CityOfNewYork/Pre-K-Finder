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
		me.currentLocation = {attributes:{title:""}};
		me.map = map;
		me.locate = locate;
		me.upkList = upkList;
		me.upkTable = upkTable;
		me.ios = navigator.userAgent.match(/(iPad|iPhone|iPod|iOS)/g) ? true : false;
		
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
		me.map.events.register("featureclick", map, me.hover);
		me.map.events.register("featureout", map, me.out);
		
		$(window).resize(function(){
			me.map.render(map.div);
		});
		
		$(nyc).on("locate.found", function(_, f){
			me.currentLocation = f;
			var i = setInterval(function(){
				if (me.upkList.ready){
					me.upkTable.render(me.upkList, f.geometry);		
					me.upkInView();
					clearInterval(i);
				}
			}, 200);
			$("#callout").remove();
			me.pop = null;
		});
		
		$.ajax({
			url:"upk.json",
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
				var upk = this.upkList.upk(id), g = upk.geometry;
				this.map.setCenter(new OpenLayers.LonLat(g.x, g.y), 8);
				upk.upkFeature.renderIntent = "select";
				$("#toggleToMap").trigger("click");
				this.upkLayer.redraw();
				this.identify(upk);
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
					me.upkTable.render(me.upkList, me.currentLocation.geometry);
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
				$("#callout").remove();
				this.pop = null;
				$(this.upkLayer.div).trigger("click"); /* if we don't do this you can't identify same feature after closing popup - why? - dunno */
				$(nyc).trigger("app.removeCallout");
			},
			identify:function(f){
				var me = this, 
					g = f.geometry, 
					p = new OpenLayers.LonLat(g.x, g.y), 
					upk = me.upkList.upk(f.id),
					loc = me.currentLocation,
					html = new nyc.UpkInfo(upk, loc.attributes.title).render("callout");
			    if (me.pop) me.removeCallout();
				me.pop = new OpenLayers.Popup.FramedCloud("callout", p, null, html, null, true, function(){me.removeCallout();});
				me.pop._f = f;
				me.pop.maxSize = new OpenLayers.Size(300, 175);
		    	me.map.addPopup(me.pop);
		    	$(me.pop.closeDiv).removeClass("olPopupCloseBox");
		    	$(me.pop.closeDiv).addClass("ui-icon-delete");
		    	$(me.pop.closeDiv).css({width:"24px", height:"24px"});
		    	$(nyc).trigger("app.identify");
			},
			external:function(n){
				var url = $(n).data("href"), target = n.target;
		    	$("#iframeContainer iframe").prop("src", "");
				$("#iframeContainer")[target == "feedback" ? "addClass" : "removeClass"]("feedback");
				if (navigator.standalone){ /* safari in standalone mode on ios */
					$("#iframeContainer").addClass("firstLoad");
					$("#iframeContainer iframe").css("visibility", "hidden");
					$("#iframeContainer iframe").one("load", function(){
						if (target == "feedback"){
							try{
								$($("#iframeContainer iframe")[0].contentWindow.document.body).width($(window).width());
							}catch(ignore){}
						}
						$("#iframeContainer").removeClass("firstLoad");
						$("#iframeContainer iframe").css("visibility", "visible");
					});
			    	$("#iframeContainer iframe").prop("src", url);
			    	$("#external").slideToggle();
				}else{
					window.open(url, target);
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
		(function(){
			var uris = [],
				protocol = document.location.protocol + "//",
				host = document.location.hostname;
			if (host == "localhost") host = DEV_HOST;
			if (host != "maps.nyc.gov"){
				uris.push(protocol + host + BASEMAP_URI);
			}else{
				for (var i = 1; i < 4; i++){
					var parts = host.split(".");
					uris.push(protocol + parts[0] + i + host.substr(host.indexOf(".")) + BASEMAP_URI);
				}
			}
			return uris;
		})(),
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
	
	$("#copyright").html("&copy; " + new Date().getFullYear() + " City of New York");
	
});