/** @export */
window.nyc = window.nyc || {};

/** @export */
nyc.Lang = (function(){
	/**
	 * @export
	 * 
	 * Class for language translation 
	 * @constructor
	 * 
	 * @param {string} selector
	 * @param {Object} languages
	 * 
	 */
	var langClass = function(target, languages){
		var codes = [], langs = {}, div = $(nyc.Lang.HTML);
		nyc.lang = this;
		$(target).append(div);
		for (var code in languages){
			var val = languages[code].val, opt = $("<option></option>");
			opt.attr("value", val);
			opt.html(languages[code].desc);
			$("#lang-choice").append(opt);
			langs[code] = val;
			codes.push(code);
		}
		this.codes = codes.toString();
		this.langs = langs;
		div.trigger("create");
		$("#lang-choice-button").addClass("ctl-btn");
		$('body').append('<script src="//translate.google.com/translate_a/element.js?cb=nyc.lang.init"></script>');
		setInterval($.proxy(this.hack, this), 200);
	};
	
	langClass.prototype = {
		/** @export */
		langs: null,
		/** @export */
		init: function(){
			nyc.lang.translate = new google.translate.TranslateElement({
				pageLanguage: "en",
				includedLanguages: nyc.lang.codes,
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
				autoDisplay: false
			}, "lang-trans");
			$("#lang-choice").show();
			nyc.lang.initDropdown();
			nyc.lang.setLangDropdown();
			nyc.lang.hack();
			$('#lang-btn').show();
			$(nyc.lang).trigger('ready');
		},
		/** @export */
	    initDropdown: function(){
			$("#lang-choice").change(function(){
				$(this).blur();
				var lang = $(this).val();
				var frame = $("iframe.goog-te-menu-frame:first");
				if (!frame.size()){
					return false;
				}
				$(frame.contents().find(".goog-te-menu2-item span.text")).each(function( index ){
					if ($(this).text() == lang){
						if (lang == "English"){
							nyc.lang.showOriginalText();
							return false;
						}
						$(this).click();
						return false;
					}
				});
				return false;
			});
		},
		/** @export */
		showOriginalText: function(){
			var googBar = $("iframe.goog-te-banner-frame:first");
			$( googBar.contents().find(".goog-te-button button") ).each(function( index ){
				if ( $(this).text() == "Show original" ){
					$(this).trigger("click");
					if ($("#lang-choice").val() != "English"){
						$("#lang-choice").val("English");
					}
					return false;
				}
			});
		},
		/** @export */
		setLangDropdown: function(){
			var cookieVal = this.getCookieValue();
			if (cookieVal){
				$("#lang-choice").val(this.langs[cookieVal]);
			}
		},
		/** @export */
		hack: function(){
			/*
			 * google translate doesn't translate placeholder attributes
			 * so we'll add a hidden span after input elements that have placeholders
			 * then use the placeholder text for the span
			 * then apply the translation of the span back to the placeholder
			 */
			$.each($('input[placeholder]'), function(_, input){
				var next = $(input).next();
				if (!next.hasClass('lang-placeholder')){
					$(input).after('<span class="lang-placeholder">' + $(input).attr('placeholder') + '</span>');
				}else{
					$(input).attr('placeholder', next.html().replace(/<font>/g, '').replace(/<\/font>/g, ''));
				}
			});
			/*
			 * fix jquery buttons crippled by font tags added by google translate
			 */
			$.each($('font'), function(_, elem){
				if ($(elem).data('lang-hack') != 'hacked'){
					var parent = $(elem).parent();
					$(elem).data('lang-hack', 'hacked');
					if (parent.length && parent[0].tagName.toUpperCase() != 'FONT' && parent.data('role') == 'button'){
						$(elem).click(function(event){
							event.stopImmediatePropagation();
							parent.trigger('click');
						});
					}
				}
			});
			$(document.getElementById(':2.container')).hide();
			$('body').css('top', 'auto');
			$('#goog-gt-tt').remove();
		},
		/** 
		 * @private 
		 * @return {string}
		 */
		getCookie: function(){
		    var nameEQ = "googtrans=";
		    var ca = document.cookie.split(";");
		    for (var i=0; i < ca.length; i++){
		        var c = ca[i];
		        while (c.charAt(0) == " ") c = c.substring(1, c.length);
		        if ( c.indexOf(nameEQ) == 0 ){
		            return c.substring(nameEQ.length,c.length);
		        }
		    }
		},
		/** 
		 * @private 
		 * @return {string}
		 */
		getCookieValue: function(){
			var transCookie = this.getCookie();
			if (transCookie){
				transCookie = transCookie.split("/");
				transCookie = transCookie[2];
				return transCookie;
			}
		}
	};
	
	return langClass;
})();

/**
 * @private
 * @const
 * @type {string}
 */
nyc.Lang.HTML = 
	"<div id='lang-btn'>" +
		"<div id='lang-trans'></div>" +
		"<select id='lang-choice' class='notranslate' translate='no'></select>" +
	"</div>";