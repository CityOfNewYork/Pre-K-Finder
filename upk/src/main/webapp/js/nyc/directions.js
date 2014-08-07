window.nyc = window.nyc || {};

window.directionArgs = {};
window.directions;

function mode(mode){
	directionArgs.mode = mode;
	window.directions.directions(directionArgs);	
};

function toggle(n){
	$("#dirToggles a").removeClass("ui-btn-active");
	$(n).addClass("ui-btn-active");
	$("#dirPanel").slideToggle();
};

nyc.Directions = (function(){
	var dirClass = function(map){
		this.map = map;
		this.service = new google.maps.DirectionsService();
		this.renderer = new google.maps.DirectionsRenderer();
	};
	dirClass.prototype = {
		directions: function(args) {
			var me = this, mode = args.mode || "TRANSIT";
			this.service.route(
				{
					origin: args.from,
					destination: args.to,
					travelMode: google.maps.TravelMode[mode]
				},
				function (response, status){
					if (status == google.maps.DirectionsStatus.OK) {
						var leg = response.routes[0].legs[0],
							addrA = leg.start_address.replace(/\, USA/, ""),
							addrB = leg.end_address.replace(/\, USA/, "");
						me.renderer.setOptions({
							map: me.map,
							panel: $("#directions")[0],
							directions: response
						});
						$("#from").val(addrA);
						$("#to").html(addrB);
					}
					$(".modeBtn").removeClass("activeMode");
					$("#" + mode.toLowerCase()).addClass("activeMode");
					me.height();
				}
			);
		},
		height: function(){
			if ($(window).width() > 485 && !navigator.standalone){
				var h =  $("#dirToggles").css("display") == "block" ? $("#dirToggles").height() : 0;
				$("#directions").height($(window).height() - h - $("#dirContent").height() - 10);
			}
		},
		addMarker: function(p, title, icon){
			new google.maps.Marker({
				map:me.map,
				optimized: false,
				position:p,
				icon:icon,
				title:title,
				zIndex:google.maps.Marker.MAX_ZINDEX
		    });		
		}
	};
	return dirClass;
}());

$(document).ready(function(){
	var map = new google.maps.Map($("#map")[0], {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		backgroundColor: "#D3D3D3",
		panControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		zoomControl: false,
		maxZoom: 18,
			styles: [
	        {
				featureType: "administrative.country",
				stylers:[{visibility: "off"}]
			},
			{
				featureType: "administrative.province",
				stylers: [{visibility: "off"}]},
			{
				featureType: "administrative.land_parcel",
				stylers: [{visibility: "off"}]
			},
			{
				featureType: "landscape.man_made",
				stylers: [{visibility: "on"}]
			},
			{
				featureType: "poi.attraction",
				stylers: [{visibility: "off"}]
			},
			{
				featureType: "poi.business",
				stylers: [{visibility: "off" }]
			},
			{
				featureType: "poi.place_of_worship",
				stylers: [{visibility: "off"}]
			},
			{
				featureType: 	"water", 
				elementType: "geometry", 
				stylers: [{hue: "#A1D5F1"}, {saturation: 55}, {lightness: 13}, {visibility: "on"}]
			},
			{
				featureType: "transit.line",
				stylers: [{visibility: "off"}]
			},
			{
				featureType: "road.arterial", 
				elementType: "all",
				stylers: [{hue: "#d4d4d4"}, {saturation: -100}, {lightness: 27}, {visibility: "on"}]
			},
			{
				featureType: "road.local",
				elementType: "all",
				stylers: [{hue: "#e8e8e8"}, {saturation: -100}, {lightness: -9}, {visibility: "on"}]
			},
			{
				featureType: "road.highway",
				elementType: "all",
				stylers: [{hue: "#bababa"}, {saturation: -100}, {lightness: 25}, {visibility: "on"}]
			},
			{
				featureType: "poi.park",
				elementType: "all", 
				stylers: [{hue: "#D6DDD5"}, {saturation: -76}, {lightness: 32}, {visibility: "on"}] 
			},
			{ 
				featureType: "poi.school", 
				elementType: "all", 
				stylers: [{hue: "#DAD4C3"}, {saturation: -51}, {lightness: -2}, { visibility: "on"}] 
			}
		]
	});
	
	var params = document.location.search.substr(1).split("&");
	for (var i = 0; i < params.length; i++){
		var p = params[i].split("=");
		directionArgs[p[0]] = decodeURIComponent(p[1]);
	};
	
	$("#from").keypress(function(e){
		if (e.keyCode == 13){
			directionArgs.from = $("#from").val();
			window.directions.directions(directionArgs);
		}
	});
	$("#toUpk").html(directionArgs.upk);
	window.directions = new nyc.Directions(map);
	if (directionArgs.from){
		window.directions.directions(directionArgs);
	}else{
		$("#to").html(directionArgs.to);
	}
	
	$(window).resize(window.directions.height);
});