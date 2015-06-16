window.nyc = window.nyc || {};

nyc.info = {
	dob: null,
	submitting: false,
	init: function(){
		$("#dob").empty();
		this.dob = new nyc.DateField("#dob", MIN_DOB_YEAR, MAX_DOB_YEAR);
		$("#apply-submit").click($.proxy(nyc.info.valid, nyc.info));
		$("#form-note").html(FORM_MSG);
		$("#dob-note").html(DOB_MSG);
		$("#dob").trigger("create");
		$("#info-page .banner-school-yr").html("for School Year " + SCHOOL_YEAR);
		$("#info-page select").on("change", function(e){
			$(e.target).focus(window.IOS ? null : 10);
		});
	},
	valid: function(){
		var err = [];
		$("#info-page label, #info-page span").removeClass("err");
		if (!this.dob.val()){
			err.push(this.dob.selectMonth[0]);
			$("label[for='dob']").addClass("err");												
		}
		$.each($("#info-page input, #info-page select"), function(_, n){
			if ($(n).prop("required") || $(n).attr("required")){
				var val = $(n).val(), pattern = $(n).attr("pattern") || $(n).data("pattern"), valid = val.length;
				if (valid && pattern){
					var regex = new RegExp(pattern);
					valid = regex.test(val);
				}
				if (!valid){
					err.push(n);
					$("label[for='" + n.id + "']").addClass("err");												
				}
			}
		});
		if (err.length){
			$(err[0]).focus();
		}else{
			this.review();
		}
		return false;
	},
	review: function(){
		var data = this.formData();
		for (var d in data){
			$("#review_" + d).html(data[d].toString());
		}
		$("#review").fadeIn();
		if ($("#review").height() > 320) $("#review-submit").focus(200);
	},
	formData: function(){
		var result = {};
		result.dob = this.dob.val();
		result.house_number = $("#house_number").val();
		result.street_name = $("#street_name").val();
		result.apt = $("#apt").val();
		result.borough = $("#borough").val();
		result.zip_code = $("#zip_code").val();
		result.parent_first_name = $("#parent_first_name").val();
		result.parent_last_name = $("#parent_last_name").val();
		result.relationship = $("#relationship").val();
		result.day_telephone = $("#day_telephone").val();
		result.evening_telephone = $("#evening_telephone").val();
		result.email = $("#email").val();
		return result;
	},
	messages: function(){
		return "&thanks=" + encodeURIComponent($("#form-handler-thank-you").html()) +
			"&error=" + encodeURIComponent($("#form-handler-error").html()) +
			"&ok=" + encodeURIComponent($("#form-handler-ok").html());
	},
	apply: function(){
		var data = {id: 0, method: "apply", jsonrpc: "2.0", params: {action:"apply", formfields: this.formData()}},
			url = FORM_HANDLER_URL + "?data=" + JSON.stringify(data) + "&lang=" + (nyc.lang ? nyc.lang.lang() : "en");
		if (nyc.app){
			nyc.app.changePage(url, nyc.app);
		}else{
			document.location = url;
		}
	}
};

$("document").ready(function(){
	if (document.location.pathname.indexOf("get-in-touch.html") > -1){
		$("#info-back").hide();
		nyc.info.init();
	}		
});