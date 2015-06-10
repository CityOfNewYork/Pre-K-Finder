/** @export */
window.nyc = window.nyc || {};

/** @export */
nyc.Directions = (function(){
	/**
	 * nyc.Directions
	 * @constructor
	 * @param {Object} args
	 * @param {string} target
	 */
	var dirClass = function(args, target){ 
		var me = this;
		me.target = target;
		me.args = args;
		nyc.directions = me;
		//TODO use our google clientid
		$.getScript('https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=upksensor=false&libraries=visualization&callback=nyc.directions.init');
		$('.dir-mode-btn').click($.proxy(this.mode, this));
		$(window).on('orientationchange resize', me.height);
		$('#fld-from input').keypress(function(e){
			if (e.keyCode == 13){
				me.args.from = $('#fld-from input').val();
				me.directions(me.args);
			}
		});
		$("#dir-toggle a").click(function(e){
			$("#dir-toggle a").removeClass("ui-btn-active");
			$(e.target).addClass("ui-btn-active");
			$("#dir-panel").slideToggle();
		});
	};

	dirClass.prototype = {
		/** @private */
		args: null,
		/** @private */
		modeBtn: '#mode-transit',
		/**
		 * @export
		 * @param {Object} args
		 */
		directions: function(args) {
			var me = this, mode = args.mode || 'TRANSIT';
			me.args = args;
			$('#fld-from input').val(args.from || '');
			$('#fld-to').html(args.to);
			$('#fld-facility').html(args.facility);
			if (args.from) {
				this.service.route(
					{
						origin: args.from,
						destination: args.to,
						travelMode: google.maps.TravelMode[mode]
					},
					function (response, status){
						if (status == google.maps.DirectionsStatus.OK) {
							var leg = response.routes[0].legs[0],
								addrA = leg.start_address.replace(/\, USA/, ''),
								addrB = leg.end_address.replace(/\, USA/, '');
							me.renderer.setOptions({
								map: me.map,
								panel: $('#directions')[0],
								directions: response
							});
							$('#fld-from input').val(addrA);
							$('#fld-to').html(addrB);
						}
						$('.dir-mode-btn').removeClass('active-mode');
						$(me.modeBtn).addClass('active-mode');
						me.height();
					}
				);
			}
		},
		/** @private */
		init: function(){
			this.map = new google.maps.Map($(this.target)[0], {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				backgroundColor: '#D3D3D3',
				panControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				zoomControl: false,
				maxZoom: 18,
					styles: [
					{
						featureType: 'administrative.country',
						stylers:[{visibility: 'off'}]
					},
					{
						featureType: 'administrative.province',
						stylers: [{visibility: 'off'}]},
					{
						featureType: 'administrative.land_parcel',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'landscape.man_made',
						stylers: [{visibility: 'on'}]
					},
					{
						featureType: 'poi.attraction',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'poi.business',
						stylers: [{visibility: 'off' }]
					},
					{
						featureType: 'poi.place_of_worship',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 	'water',
						elementType: 'geometry',
						stylers: [{hue: '#A1D5F1'}, {saturation: 55}, {lightness: 13}, {visibility: 'on'}]
					},
					{
						featureType: 'transit.line',
						stylers: [{visibility: 'off'}]
					},
					{
						featureType: 'road.arterial',
						elementType: 'all',
						stylers: [{hue: '#d4d4d4'}, {saturation: -100}, {lightness: 27}, {visibility: 'on'}]
					},
					{
						featureType: 'road.local',
						elementType: 'all',
						stylers: [{hue: '#e8e8e8'}, {saturation: -100}, {lightness: -9}, {visibility: 'on'}]
					},
					{
						featureType: 'road.highway',
						elementType: 'all',
						stylers: [{hue: '#bababa'}, {saturation: -100}, {lightness: 25}, {visibility: 'on'}]
					},
					{
						featureType: 'poi.park',
						elementType: 'all',
						stylers: [{hue: '#D6DDD5'}, {saturation: -76}, {lightness: 32}, {visibility: 'on'}]
					},
					{
						featureType: 'poi.school',
						elementType: 'all',
						stylers: [{hue: '#DAD4C3'}, {saturation: -51}, {lightness: -2}, { visibility: 'on'}]
					}
				]
			});
			this.service = new google.maps.DirectionsService();
			this.renderer = new google.maps.DirectionsRenderer();
			this.directions(this.args);
		},
		/** @private */
		mode: function(e){
			this.modeBtn = e.target;
			this.args.mode = $(this.modeBtn).data('mode');
			this.directions(this.args);
		},
		/** @private */
		height: function(){
			//if ($(window).width() > 485 && !navigator.standalone){
				var h =  $('#dir-toggle').css('display') == 'block' ? $('#dir-toggle').height() : 0;
				$('#directions').height($('#dir-panel').height() - h - $('.banner').height() - $('#dir-content').height() - 10);
			//}
		}
	};
	return dirClass;
}());
