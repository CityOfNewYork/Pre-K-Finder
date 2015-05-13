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
	 * @param {string} languages
	 * 
	 */
	var langClass = function(target, languages){
		nyc.lang = this;
		this.target = target;
		this.languages = languages;
		$(target).append(nyc.Lang.HTML).trigger('create');
		$('body').append('<script src="//translate.google.com/translate_a/element.js?cb=nyc.lang.init"></script>');
		setInterval($.proxy(this.hack, this), 200);
	};
	
	langClass.prototype = {
		/** @private */
		init: function(){
			nyc.lang.translate = new google.translate.TranslateElement({
				pageLanguage: 'en-US',
				includedLanguages: nyc.lang.languages,
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE, 
				autoDisplay: false
			}, 'lang-btn');
			nyc.lang.hack();
			$('head').append('<link rel="stylesheet" href="css/lang.css" type="text/css">');
			$('#lang-btn').show();
			$('#lang-btn').click(function(){
				nyc.lang.translate.setEnabled(false);
			});
			$(nyc.lang).trigger('ready');
		},
		/** @private */
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
	'<a id="lang-btn" class="ctl ctl-btn" data-role="button" title="Translate..." style="display:none">' +
		'<span class="noshow">Translate...</span>' +
	'</a>';