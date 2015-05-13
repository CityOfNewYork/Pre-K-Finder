window.IE8 = true;

var IE8_DEFAULT_DATES = {
	TODAY: new Date(),
	APPLY_START_DATE: "03/16/2015",
	APPLY_END_DATE: "04/25/2015",
	DEFAULT_DOB_ENTRY: "01/01/2011",
	SCHOOL_YEAR: "2015-16"
};

function unIso(dateString){
	if (typeof dateString != "string") return dateString;
	var dateParts = dateString.split("-");
	return dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
};

function ie8Date(dateString){
	return dateString : new Date(unIso(dateString)) : new Date();
};

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}
