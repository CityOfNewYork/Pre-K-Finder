window.nyc = window.nyc || {};

nyc.UpkInfo = (function(){
	/*
	 * nyc.UpkInfo extends an  nyc.Upk object to provide Upk rendering functionality
	 * @constructor
	 *
	 * @param {nyc.Upk} upk
	 * @param {string} currentLocation
	 *
	 */
	var upkInfoClass = function(upk, currentLocation){
		this.upk = upk;
		this.currentLocation = currentLocation || {geometry:null, attributes:{}};
	};
	upkInfoClass.prototype = {
		schedule: function(upk){
			return DAY_LENGTH[upk.dayLength()];
		},
		render: function(idPrefix){
			var upk = this.upk, id = idPrefix + upk.id;
			return "<div id='" + id + "' class='upkInfo'>" +
				"<div class='name'><img class='upkType' src='img/" + upk.type() + "0.png'/>" + upk.name() + "</div>" +
				"<div class='addr'>" + upk.address1() + "</div>" +
				"<div class='addr'>" + upk.address2() + "</div>" +
				"<div class='phone'><a href='tel:" + encodeURI(upk.phone()) + "' target='_blank'>" + upk.phone() + "</a></div>" +
				"<div class='upkDetail'>" +
				"<div class='sched'>" + DAY_LENGTH[upk.dayLength()] +
				(upk.seats() ? ("<span class='seats'> - " + upk.seats() + " seats</span></div></div>") : "</div></div>") +
				"<table class='upkAction'><tbody><tr>" +
				"<td class='directions'><a class='ui-btn' onclick=\"nyc.app.direct('" +
				escape(this.currentLocation.attributes.title) + "','" + 
				escape(upk.address()) + "','" + 
				escape(upk.name().replace(/\<span class=\"duh\"\>\<br\>Call 311 for opening info\<\/span\>/, "")) + /* remove hack html added to db because last minute bs */
				"');\">Directions</a></td>" +
				"<td class='map'><a class='ui-btn' href='#' onclick=\"nyc.app.centerUpk('" + upk.id + "')\">Map</a></td>" +
				"<td class='detail'><a class='ui-btn' href='#' onclick=\"$('#" + id + " .upkDetail').slideToggle();\">Details</a></td>" +
				(upk.type() != "DOE" ? ("<td class='apply'><a class='ui-btn' onclick=\"nyc.app.changePage('" + APPLICATION_URL + this.qstr(upk) + "');\">Get in Touch</a></td>") : "") +
				"</tr></tbody></table>" +
				"</div>";
		},
		qstr: function(upk){
			var boro = this.currentLocation.attributes.borough || "";
			if (boro){
				boro = boro.substr(0, 1) + boro.substr(1).toLowerCase(); 
			}
			return "?cbeccText=" + escape(upk.name().replace(/\<span class=\"duh\"\>\<br\>Call 311 for opening info\<\/span\>/, "")) + /* remove hack html added to db because last minute bs */
				"&house_number=" + escape(this.currentLocation.attributes.houseNumber || "") +
				"&street_name=" + escape(this.currentLocation.attributes.streetName || "") +
				"&borough=" + boro +
				"&zip=" + (this.currentLocation.attributes.zip || "");
		}
	};
	return upkInfoClass;
}());

nyc.UpkTable = (function(){
	/*
	 * nyc.UpkInfo extends an  nyc.UpkTable object to provide UpkList rendering functionality
	 * @constructor
	 *
	 */
	var upkTableClass = function(){
		$(window).resize(this.fixJqCss);
		this.upkList = null;
		this.currentLocation = {geometry:null, attributes:{}};
	};
	upkTableClass.prototype = {
		render: function(upkList, currentLocation){
			var tbl = $("#upkTable");
			this.upkList = upkList;
			this.currentLocation = currentLocation || this.currentLocation;
			tbl.html("<tbody></tbody>");
			$("#more").data("current-pg", "0");
			this.rows(tbl[0], 0);
		},
		rows: function(tbl, pg){
			var start = pg * 10, end = start + 10, upks = this.upkList.upks(this.currentLocation.geometry);
			if (end >= upks.length){
				end = upks.length;
				$("#pgCtrl").hide();
			}else{
				$("#pgCtrl").show();
			}
			for (var i = start; i < end; i++){
				var upk = upks[i], tr0 = tbl.insertRow(i), td0 = tr0.insertCell(0), td1 = tr0.insertCell(1), info = new nyc.UpkInfo(upk, this.currentLocation);
				tr0.id = "table" + upk.id;
				tr0.className = upk.type();
				if (i % 2 == 0) $(tr0).addClass("oddRow");
				td0.className = "distCell";
				td1.className = "upkCell";
				td1.id = upk.id;
				if (upk.distance != null){
					$(td0).html(upk.distance.toFixed(2) + " mi");
				}
				$(td1).html(info.render("table"));
			}
			$.each($(".phone"), function(_, n){
				if (!$(n).html()) $(n).parent().hide();
			});
			$("#more").data("current-pg", pg + 1);
			this.fixJqCss();
		},
		more: function(){
			this.rows($("#upkTable")[0], $("#more").data("current-pg") * 1);
		},
		fixJqCss: function(){
			$("#upkContent").height($("body").height() - $(".banner").height() - $("#filters").height() - $("#pgCtrl .ui-btn").height());
		}
	};
	return upkTableClass;
}());