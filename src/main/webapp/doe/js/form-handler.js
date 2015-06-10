var FIREFOX = navigator.userAgent.indexOf("Firefox") > -1,
	SAFARI = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1;

function parseQueryStr(){
	var params = document.location.search.substr(1).split("&"), result = {};
	for (var i = 0; i < params.length; i++){
		var p = params[i].split("=");
		result[p[0]] = decodeURIComponent(p[1]);
	}
	return result;
};

$(document).ready(function(){
	var params = parseQueryStr();
	$("#result button").click(function(e){
		window.history.go(FIREFOX || SAFARI ? -3 : -2);
	}).html(params.ok);
	$.ajax({
		url:"./services/SchoolRpc.ashx",
		beforeSend: function(request){
			request.setRequestHeader("Content-Type", "application/json; charset-utf-8");
		},
		method:"POST",
		dataType:"json",
		data: params.data,
		success: function(response){
			if (!response.result || (!response.result.ApplicationSubmitFlag && !response.result.EmailSentFlag)){
				this.error();
				return;
			}
			message(params, params.thanks);
			$("#info-page").removeClass("info-wait");
		},
		error: function(){
			message(params, params.error);
			$("#info-page").removeClass("info-wait");
		}
	});
	return false;
});

function message(params, msg){
	$("#result-message").html(msg);
	$("#result-error")[msg == params.error ? "show" : "hide"]();
	$("#result-thanks")[msg == params.error ? "hide" : "show"]();
	$("#review").fadeOut();
	$("#result").fadeIn();
	$("#result button").focus(200);
};