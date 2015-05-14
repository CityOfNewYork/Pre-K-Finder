function localeDate(dateString){
	if (window.IE8) return ie8Date(dateString);
	var utcDate = dateString ? new Date(dateString) : new Date();
	return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
};
APPLY_START_DATE = localeDate(APPLY_START_DATE);
APPLY_END_DATE = localeDate(APPLY_END_DATE);

var TODAY = localeDate();
var GET_IN_TOUCH_ONLY = TODAY < APPLY_START_DATE || TODAY > APPLY_END_DATE;
var FORM_MSG =  GET_IN_TOUCH_ONLY ? FORM_MSG_NO_APPLY : FORM_MSG_YES_APPLY;
var THANK_YOU_MESSAGE = "Thank you for completing our Pre-K for All information form! Your submission is being " +
		"sent to the Pre-K for All Outreach team, who will contact you soon. You will also receive an email " +
		"shortly confirming your submission.";
var ERROR_MESSAGE = "There was an error processing your submission data.  Please try again.";

$("document").ready(function(){
	window.dob = new nyc.DateField("#dob", MIN_DOB_YEAR, MAX_DOB_YEAR);
	$("#dob").trigger("create");
	$("#apply-submit").click(valid);
	$("select").on("change",function(e){$(e.target).focus();});
	$("#form-note").html(FORM_MSG);
	$("#dob-note").html(DOB_MSG);
});

function valid(){
	var err = [];
	$("label, span").removeClass("err");
	if (!dob.val()){
		err.push(dob.selectMonth[0]);
		$("label[for='dob']").addClass("err");												
	}
	$.each($("input, select"), function(_, n){
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
		review();
	}
};	

function review(){				
	var data = formData();
	for (var d in data){
		$("#review_" + d).html(data[d].toString());
	}
	$("#review").css({visibility: "hidden", display:"block"});
	var bottom = $("form").height();
	$("#review").css({visibility: "visible", display:"none"});
	$("#review").css("top", bottom - $("#review").height() + "px");
	$("#review").fadeIn(function(){
		$("#result").css("top", $("#review").position().top + "px");
	});
	$("#review-submit").focus();
};

function formData(){
	var result = {};
	result.dob = dob.val();
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
};

window.submitting = false;
function apply(){
	var data = {id: 0, method: "apply", jsonrpc: "2.0", params: {action:"apply", formfields: formData()}};
	window.submitting = true;
	$.ajax({
		url:"./services/SchoolRpc.ashx?rpc",
		beforeSend: function(request){
			request.setRequestHeader("Content-Type", "application/json; charset-utf-8");
		},
		method:"POST",
		dataType:"json",
		data:JSON.stringify(data),
		success: function(response){
			if (!response.result || (!response.result.ApplicationSubmitFlag && !response.result.EmailSentFlag)){
				this.error();
				return;
			}
			$("form")[0].reset();					
			message(THANK_YOU_MESSAGE);
			window.submitting = false;						
		},
		error: function(){
			message(ERROR_MESSAGE);
			window.submitting = false;
		}
	});
	return false;
};

function message(msg){
	$("#result-message").html(msg);
	$("#result-error")[msg == ERROR_MESSAGE ? "show" : "hide"]();
	$("#result-thanks")[msg == ERROR_MESSAGE ? "hide" : "show"]();
	$("#review").fadeOut();
	$("#result").fadeIn();
	$("#result input").focus();
};