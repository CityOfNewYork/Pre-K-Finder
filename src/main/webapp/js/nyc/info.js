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
			var upk = this.upk, id = idPrefix + upk.id, target = window.ios ? "' target='_blank'>" : "'>";

			return "<div id='" + id + "' class='upkInfo'>" +
				"<div class='name'><img class='upkType' src='img/" + upk.type() + "0.png'/>" + upk.name() + "</div>" +
				(upk.note() ? ("<div class='note'>" + upk.note() + "</div>") : "") +
				"<div class='addr'>" + upk.address1() + "</div>" +
				"<div class='addr'>" + upk.address2() + "</div>" +
				"<div class='phone'><a href='tel:" + encodeURI(upk.phone()) + target + upk.phone() + "</a></div>" +
				this.renderDetail(upk, target) +
				"<table class='upkAction'><tbody><tr>" +
				"<td class='directions'><a class='ui-btn' onclick=\"nyc.app.direct('" +
				escape(this.currentLocation.attributes.title) + "','" + 
				escape(upk.address()) + "','" + 
				escape(upk.name()) +
				"');\">Directions</a></td>" +
				"<td class='map'><a class='ui-btn' href='#' onclick=\"nyc.app.centerUpk('" + upk.id + "')\">Map</a></td>" +
				this.renderFormBtn(upk) +
				"<td class='detail'>" +
				"<a class='ui-btn' href='#' onclick=\"nyc.showUpkDetail('" + upk.id + "','" + id + "');\">Details</a></td>" +
				"</tr></tbody></table>" +
				"</div>";
		},
		renderDetail: function(upk, target){
			return "<div class='upkDetail'>" + 
				"<div class='prg-code'><span class='name'>Program Code: </span>" + upk.code() + "</div>" +
				"<div class='email'><a href='mailto:" + upk.email() + target + upk.email() + "</a></div>" +
				"<div class='web'><a onclick=\"nyc.app.changePage('http://" + upk.web() + "');\">" + upk.web() + "</a></div>" +
				"<div class='name'>Program Features:</div>" +
				"<ul class='feats'>" +
				"<li class='meal'>" + MEAL[upk.meal()] + "</li>" +
				"<li class='inout'>" + IN_OUT[upk.inout()] + "</li>" +
				"<li class='extend'>" + EXTEND[upk.extend()] + "</li>" +
				"</ul>" +
				"<div class='seats'>" +
				"<span class='name'>" + SCHOOL_YEAR + " seats: </span>" + upk.seats() + " " + DAY_LENGTH[upk.dayLength()] + "</div>" +
				"</div>";
		},
		renderFormBtn: function(upk){
			var url, title;
			if (DO_APPLY && (upk.type() == "DOE" || upk.isFullDay())){
				url = APPLY_URL;
				title = APPLY_TITLE;
			}else{
				url = INFO_URL;
				title = INFO_TITLE;
			}
			return "<td class='apply'><a class='ui-btn' onclick=\"nyc.app.changePage('" + url + "');\">" + title + "</a></td>";
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
			var start = pg * 10, end = start + 10, upks = this.upkList.features(this.currentLocation.geometry);
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
			$("#upkContent").height($("body").height() - $(".banner").height() - $("#filters").height() - $("#pgCtrl .ui-btn").height() + 15);
		}
	};
	return upkTableClass;
}());

nyc.showUpkDetail = function(fid, id){
	var detail = $("#" + id +" .upkDetail"), show = detail.css("display") == "none";
	detail.slideToggle(function(){
		nyc.app.updateCallout();
		if (show){
			var upkHtml = $("#" + id),
				upkHeight = upkHtml.height(),
				upkBottom = upkHtml.position().top + upkHeight,
				content = $("#upkContent"),
				contentHeight = content.height();
			if (contentHeight > upkHeight && upkBottom > contentHeight){
				content.animate({
					scrollTop: content.scrollTop() + (upkBottom - contentHeight)
				});
			}
		}
	});
};
