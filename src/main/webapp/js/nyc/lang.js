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
	 * @param {string} hintDirection
	 * @param {number} hintDuration
	 * 
	 */
	var langClass = function(target, languages, hintDirection, hintDuration){
		var codes = [], langs = {}, div = $(nyc.Lang.HTML);
		nyc.lang = this;
		this.hintDirection = hintDirection;
		this.hintDuration = hintDuration || 2800;
		$(target).append(div);
		for (var code in languages){
			var val = languages[code].val, opt = $('<option></option>');
			opt.attr('value', val);
			opt.html(languages[code].desc);
			$('#lang-choice').append(opt);
			langs[code] = val;
			codes.push(code);
		}
		this.codes = codes.toString();
		this.langs = langs;
		div.trigger('create');
		$('#lang-choice-button').addClass('ctl-btn');
		$('#lang-choice-button, #lang-hint').click(function(){$('#lang-hint').fadeOut();});
		$('body').append('<script src="//translate.google.com/translate_a/element.js?cb=nyc.lang.init"></script>');
		setInterval($.proxy(this.hack, this), 200);
	};
	
	langClass.prototype = {
		/** @export */
		langs: null,
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
			nyc.lang.showHint();
			$(nyc.lang).trigger('ready');
		},
		/** 
		 * @export 
		 * 
		 * my sincerest apologies to all sensible people
		 */
		showHint: function(){
			var hint = $('#lang-hint'), dir = this.hintDirection, iters = this.hintDuration / 400;
	    	if (dir){
	    		var start = hint.position().left,
	    			i = 0,
	    			bounce = function(){
	    				var left = start + (i % 2 == 0 ? (dir == "left" ? 10 : -10) : (dir == "left" ? -10 : 10));
		    			if (i > iters){
		    				hint.fadeOut();
		    			}else{
			    			hint.animate({left: left + 'px'}, bounce);
		    			}
		    			i++;
	    			}; 
	    		hint.css("visibility", "visible");
	    		bounce();
	    	}else{
	    		hint.remove();
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
			var langs = this.langs, 
				defLang = navigator.language ? navigator.language.split('-')[0] : "en", 
				cookieVal = this.getCookieValue();
			if (cookieVal){
				$('#lang-choice').val(langs[cookieVal]);
			}else{
				for (var code in langs){
					if (code.indexOf(defLang) == 0){
						$('#lang-choice').val(langs[code]);
						break;
					}
				}
			}
			$('#lang-choice').trigger('change');
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
		"<div id='lang-hint'>Translate<!-- my sincerest apologies to all sensible people --></div>" +
	"</div>";