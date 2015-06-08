window.IE8 = true;

function unIso(dateString){
	if (typeof dateString != "string") return dateString;
	var dateParts = dateString.split("-");
	return dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
};

function ie8Date(dateString){
	return dateString ? new Date(unIso(dateString)) : new Date();
};

String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, ""); 
};
