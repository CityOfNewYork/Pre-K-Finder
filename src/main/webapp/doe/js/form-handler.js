function localeDate(dateString){
	if (window.IE8) return ie8Date(dateString);
	var utcDate = dateString ? new Date(dateString) : new Date();
	return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
};
APPLY_START_DATE = localeDate(APPLY_START_DATE);
APPLY_END_DATE = localeDate(APPLY_END_DATE);

var TODAY = localeDate(),
	ACTIVE_APPLY_PERIOD = TODAY >= APPLY_START_DATE && TODAY < APPLY_END_DATE,
	FORM_MSG =  ACTIVE_APPLY_PERIOD ? FORM_MSG_YES_APPLY : FORM_MSG_NO_APPLY,
	FORM_THANK_YOU_MSG = "Thank you for completing our Pre-K for All information form! Your submission is being " +
		"sent to the Pre-K for All Outreach team, who will contact you soon. You will also receive an email " +
		"shortly confirming your submission.",
	FORM_ERROR_MSG = "There was an error processing your submission data.  Please try again.",
	FIREFOX = navigator.userAgent.indexOf("Firefox") > -1;
	
$(document).ready(function(){
	$("#info-page .banner-school-yr").html("for School Year " + SCHOOL_YEAR);
	$("#result button").click(function(e){
		window.history.go(FIREFOX ? -3 : -2);
	});
	$.ajax({
		url:"./services/SchoolRpc.ashx",
		beforeSend: function(request){
			request.setRequestHeader("Content-Type", "application/json; charset-utf-8");
		},
		method:"POST",
		dataType:"json",
		data: decodeURIComponent(document.location.search.substr(1)),
		success: function(response){
			if (!response.result || (!response.result.ApplicationSubmitFlag && !response.result.EmailSentFlag)){
				this.error();
				return;
			}
			message(FORM_THANK_YOU_MSG);
			$("#info-page").removeClass("info-wait");
		},
		error: function(){
			message(FORM_ERROR_MSG);
			$("#info-page").removeClass("info-wait");
		}
	});
	return false;
});

function message(msg){
	$("#result-message").html(msg);
	$("#result-error")[msg == FORM_ERROR_MSG ? "show" : "hide"]();
	$("#result-thanks")[msg == FORM_ERROR_MSG ? "hide" : "show"]();
	$("#review").fadeOut();
	$("#result").fadeIn();
	$("#result button").focus(200);
};