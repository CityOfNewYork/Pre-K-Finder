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
	 * @param {number=} hintDuration
	 * 
	 */
	var langClass = function(target, languages, hintDuration){
		var codes = [], div = $(nyc.Lang.HTML);
		nyc.lang = this;
		$(target).append(div);
		for (var code in languages){
			var opt = $('<option></option>')
				.attr('value', languages[code].val)
				.html(languages[code].desc);
			$('#lang-choice').append(opt);
			codes.push(code);
			this.hints.push(languages[code].hint);
		}
		this.hintDuration = hintDuration;
		this.codes = codes.toString();
		this.languages = languages;
		div.trigger('create');
		$('#lang-choice-button').addClass('ctl-btn');
		$('#lang-choice-button, #lang-hint').click(function(){
			$('#lang-hint').fadeOut();
		});
		$('body').append('<script src="//translate.google.com/translate_a/element.js?cb=nyc.lang.init"></script>');
		setInterval($.proxy(this.hack, this), 200);
	};
	
	langClass.prototype = {
		/** private */
		codes: "",
		hints: [],
		/** @export */
		languages: null,
		/** @export */
		init: function(){
			nyc.lang.translate = new google.translate.TranslateElement({
				pageLanguage: 'en',
				includedLanguages: nyc.lang.codes,
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
				autoDisplay: false
			}, 'lang-trans');
			$('#lang-choice').show();
			nyc.lang.initDropdown();
			nyc.lang.setLangDropdown();
			nyc.lang.hack();
			$(nyc.lang).trigger('ready');
		},
		/** 
		 * @export 
		 * 
		 * my sincerest apologies to all sensible people
		 */
		showHint: function(){
			var duration = this.hintDuration, hints = this.hints;
	    	if (duration){
	    		var h = 1,
	    			i = 0,
		    		interval = setInterval(function(){
		    			$('#lang-hint span').html(hints[h] || "Translate");
	    				h++;
	    				if (h == hints.length) h = 0;
		    			if (i > duration){
		    				clearInterval(interval);
		    				$('#lang-hint').fadeOut();
		    			}
		    			i += 1000;
	    			}, 1000);
	    		$('#lang-hint').fadeIn();
	    	}else{
	    		$('#lang-hint').remove();
	    	}
	    },
	    chooseLang: function(lang){
			var choices = $('iframe.goog-te-menu-frame:first').contents().find('.goog-te-menu2-item span.text');
			if (choices.length){
				$(choices).each(function(index){
					if ($(this).text() == lang){
						if (lang == 'English'){
							nyc.lang.showOriginalText();
							return false;
						}
						$(this).click();
						return false;
					}
				});
				$(nyc.lang).trigger("change", nyc.lang.lang());
			}else{
				var me = this;
				setTimeout(function(){me.chooseLang(lang);}, 100);
			}
		},
		/** @export */
	    initDropdown: function(){
	    	var me = this;
			$('#lang-choice').change(function(){
				me.chooseLang($(this).val());
			});
		},
		/** @export */
		showOriginalText: function(){
			var googBar = $('iframe.goog-te-banner-frame:first');
			$( googBar.contents().find('.goog-te-button button') ).each(function(index){
				if ($(this).text() == 'Show original'){
					$(this).trigger('click');
					if ($('#lang-choice').val() != 'English'){
						$('#lang-choice').val('English');
					}
					return false;
				}
			});
		},
		/** @export */
		setLangDropdown: function(){
			var defLang = navigator.language ? navigator.language.split('-')[0] : "en", 
				langCode = this.getCookieValue();
			if (!langCode || langCode == defLang) this.showHint();
			if (!langCode){
				for (var code in this.languages){
					if (code.indexOf(defLang) == 0){
						langCode = code;
						break;
					}
				}
				langCode = langCode || 'en';
			}
			$('#lang-choice').val(this.languages[langCode].val).trigger('change');
		},
		/** @export */
		lang: function(){
			return this.getCookieValue() || 'en';
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
			$('body').css('top', 'auto');
			$('#goog-gt-tt').remove();
		},
		/** 
		 * @private 
		 * @return {string}
		 */
		getCookie: function(){
		    var ca = document.cookie.split(';');
		    for (var i = 0; i < ca.length; i++){
		        var c = ca[i];
		        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		        if ( c.indexOf('googtrans=') == 0 ){
		            return c.substring(10, c.length);
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
				transCookie = transCookie.split('/');
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
	"<div id='lang-btn' title='Translate...'>" +
		"<div id='lang-trans'></div>" +
		"<select id='lang-choice' class='notranslate' translate='no'></select>" +
		"<div id='lang-hint' class='notranslate' translate='no'>" +
			"<span>Translate</span>" +
			"<!-- my sincerest apologies to all sensible people -->" +
			"<a data-role='button' data-icon='delete' data-iconpos='notext'>Close</a>"+
		"</div>" +
	"</div>";