/** @export */
window.nyc = window.nyc || {};

/** @export */
nyc.DateField = (function(){

	/**
	 * @export
	 * 
	 * Class for date input 
	 * @constructor
	 * 
	 * @param {string|Element} target
	 * @param {number} minYear
	 * @param {number} maxYear
	 * 
	 */
	var dateFieldClass = function (target, minYear, maxYear){
		var me = this;

		if (minYear) me.minYear = minYear * 1;
		if (maxYear) me.maxYear = maxYear * 1;
		
		me.selectMonth = $("<select class='date-month'><option value='0'>month</option></select>");
		me.selectDate = $("<select class='date-date'><option value='0'>date</option></select>");
		me.selectYear = $("<select class='date-year'><option value='0'>year</option></select>");

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

		me.selectMonth.val("0");
		me.selectDate.val("0");
		me.selectYear.val("0");

		$(this.selectMonth).change($.proxy(me.dates, me));
		$(this.selectYear).change($.proxy(me.dates, me));
	};

	dateFieldClass.prototype = {
		/** @private */
		months: [{name: "January", days: 31}, {name: "February", days: 28}, {name: "March", days: 31}, {name: "April", days: 30}, {name: "May", days: 31}, {name: "June", days: 30}, {name: "July", days: 31}, {name: "August", days: 31}, {name: "September", days: 30}, {name: "October", days: 31}, {name: "November", days: 30}, {name: "December", days: 31}],
		/** @private */
		selectMonth: null,
		/** @private */
		selectDate: null,
		/** @private */
		selectYear: null,
		/** @private */
		minYear: 1900,
		/** @private */
		maxYear: 2100,
		/** @private */
		pad: function(number){
			return (number < 10 ? "0" : "") + number;
		},
		/** @export */
		val: function(){
			var year = this.selectYear.val(), month = this.selectMonth.val(), date = this.selectDate.val();
			if (year * 1 > 0 && month * 1 > 0 && date * 1 > 0) {
				return month + "/" + date + "/" + year;
			}
		},
		/** @private */
		leap: function(){
			var year = this.selectYear.val() * 1;
			if (year) return (year % 100 == 0) ? (year % 400 == 0) : (year % 4 == 0);
		},
		/** @private */
		days: function(month){
			var days = this.months[month].days;
			if (month == 1 && this.leap()) return days + 1;
			return days;
		},
		/** @private */
		dates: function(){
			var month = this.selectMonth[0].selectedIndex - 1, selectDate = this.selectDate, chosenDate = selectDate.val();
			if (month > -1) {
				var days = this.days(month);
				selectDate.html("<option value='0'>date</option>");
				for (i = 0; i < days; i++){
					var option = $("<option></option>"), date = this.pad(i + 1);
					option.attr("value", date).html(date);
					selectDate.append(option);
				}
			}
			selectDate.val("0");
			$.each(selectDate.children(), function(_, opt){
				if ($(opt).val() == chosenDate){
					selectDate.val(chosenDate);
					return;
				}
			});
			/* if jquerymobile */
			if (selectDate.selectmenu) selectDate.selectmenu("refresh", true);
		}
	};

	return dateFieldClass;

}());
