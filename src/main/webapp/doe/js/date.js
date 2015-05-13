window.nyc = window.nyc || {};

nyc.DateField = (function(){

	var dateFieldClass = function (target, minYear, maxYear){
		var me = this;

		if (minYear) me.minYear = minYear * 1;
		if (maxYear) me.maxYear = maxYear * 1;

		$.each(me.months, function(i, month){
			var option = $("<option></option>");
			option.attr("value", me.pad(i + 1)).html(month.name);
			me.selectMonth.append(option);
		});

		for (i = me.minYear; i <= me.maxYear; i++){
			var option = $("<option></option>");
			option.attr("value", i).html(i);
			me.selectYear.append(option);
		}

		var table = $("<table><tbody><tr></tr></tdody></table>"), row = table[0].rows[0];
		$(target).append(table);
		$(row.insertCell(0)).append(me.selectMonth);
		$(row.insertCell(1)).append(me.selectDate);
		$(row.insertCell(2)).append(me.selectYear);

		$(this.selectMonth).change($.proxy(me.dates, me));
		$(this.selectYear).change($.proxy(me.dates, me));
	};

	dateFieldClass.prototype = {
		months: [{name: "January", days: 31}, {name: "February", days: 28}, {name: "March", days: 31}, {name: "April", days: 30}, {name: "May", days: 31}, {name: "June", days: 30}, {name: "July", days: 31}, {name: "August", days: 31}, {name: "September", days: 30}, {name: "October", days: 31}, {name: "November", days: 30}, {name: "December", days: 31}],
		selectMonth: $("<select id='date-month'><option value='0'>month</option></select>"),
		selectDate: $("<select id='date-date'><option value='0'>date</option></select>"),
		selectYear: $("<select id='date-year'><option value='0'>year</option></select>"),
		minYear: 1900,
		maxYear: 2100,
		pad: function(number){
			return (number < 10 ? "0" : "") + number;
		},
		val: function(){
			var year = this.selectYear.val(), month = this.selectMonth.val(), date = this.selectDate.val();
			if (year * 1 > 0 && month * 1 > 0 && date * 1 > 0) {
				return month + "/" + date + "/" + year;
			}
		},
		leap: function(){
			var year = this.selectYear.val() * 1;
			if (year) return (year % 100 == 0) ? (year % 400 == 0) : (year % 4 == 0);
		},
		days: function(month){
			var days = this.months[month].days;
			if (month == 1 && this.leap()) return days + 1;
			return days;
		},
		dates: function(){
			var month = this.selectMonth[0].selectedIndex - 1, chosenDate = this.selectDate.val();
			if (month > -1) {
				var days = this.days(month);
				this.selectDate.html("<option value='0'>date</option>");
				for (i = 0; i < days; i++){
					var option = $("<option></option>"), date = this.pad(i + 1);
					option.attr("value", date).html(date);
					this.selectDate.append(option);
				}
			}
			if ($("#date-date option[value='" + chosenDate + "']").length){
				this.selectDate.val(chosenDate);				
			}else{
				this.selectDate.val("0");
			}
			/* if jquerymobile */
			if (this.selectDate.selectmenu) this.selectDate.selectmenu("refresh", true);
		}
	};

	return dateFieldClass;

}());

function localeDate(dateString){
	if (window.IE8) return ie8Date(dateString);
	var utcDate = dateString ? new Date(dateString) : new Date();
	return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
};
