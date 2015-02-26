nyc.ZoomSearch = function(target, map){
	var me = this;
	me.map = map;
	$(target).append(nyc.ZoomSearch.HTML).trigger('create');
	$('#btn-z-in, #btn-z-out').click($.proxy(me.zoom, me));
	$('#btn-srch-typ').click($.proxy(me.chooseSource, me));
	$('#fld-srch-container input').on('keyup change', $.proxy(me.key, me));
	$('#fld-srch-container input').on('blur focus', function(e){
		$('#btn-srch-typ')[e.type == 'focus' ? 'addClass' : 'removeClass']('ctl-active');
	});
	$('#srch-type-addr').click(function(){
		me.setSourceList('srch-type-addr');
	});
};

nyc.ZoomSearch.prototype = {
	/** @private */
	map: null,
	/** @private */
	zoom: function(by){
		var map = this.map;
		map.zoomTo(map.getZoom() + by);
	},
	/** @private */
	key: function(e){
		setTimeout(function(){
			$('#btn-srch-typ')[$('#fld-srch-container input').val().trim().length ? 'hide' : 'fadeIn']();
		}, 500);
		if (e.keyCode == 13){
			this.search();
			$('#fld-srch').slideUp();
		}else{
			$('#fld-srch').slideDown();
		}
	},
	/** @private */
	search: function(){
		var input = $('#fld-srch-container input').val().trim();
		if (input.length)
			$(this).trigger('search', input, this);
	},
	/** @private */
	chooseSource: function(){
		var button = $('#btn-srch-typ');
		$('#mnu-srch-typ').slideToggle();
		if (button.hasClass('ui-icon-carat-d')){
			button.removeClass('ui-icon-carat-d').addClass('ui-icon-carat-u');
		}else{
			button.removeClass('ui-icon-carat-u').addClass('ui-icon-carat-d');			
		}
	},	
	/** @private */
	cssClass: function(obj){
		var cssClass = obj.name.trim().toLowerCase().replace(/[^A-Za-z0-9]/g, '-');
		obj.cssClass = cssClass;
		return cssClass;
	},	
	/** @private */
	setListCss: function(){
		$('#mnu-srch-typ li.ui-last-child, #fld-srch li.ui-last-child').last().removeClass('ui-last-child');
		$('#mnu-srch-typ li, #fld-srch li').last().addClass('ui-last-child');
		$('#mnu-srch-typ li, #fld-srch li').first().addClass('ui-first-child');
	},	
	/** @private */
	setSourceList: function(cssClass, noChoose){
		var plcHldr = cssClass == 'srch-type-addr' ? 'Search for an address...' : 'Search by school name...', name;
		$.each(this.sources, function(_, src){
			if (src.cssClass == cssClass) name = src.name;
		});
		$('#fld-srch').filterable('option', 'filterPlaceholder', plcHldr);
		$('#fld-srch-retention').append($('#fld-srch li'));
		$('#fld-srch').append($('li.' + cssClass));
		if (!noChoose) this.chooseSource();
	},
	/** @private */
	addFeatures: function(namedSource){
		var me = this, src = namedSource.source;
		$.each(src.features(), function(_, feature){
			var name = feature.name(), p = feature.geometry.getCentroid(),
				li = $('<li class="ui-li-static ui-body-inherit ui-screen-hidden ' +  
					me.cssClass(namedSource) + '">' + name + '</li>');
			$('#fld-srch-retention').append(li);
			li.click(function(){
				$(me).trigger('disambiguated', {
					fid: feature.id,
					name: name,
					coordinates: [p.x, p.y]
				});
				li.parent().slideUp();
			});
		});
	}
};

/**
 * @export
 * @param {nyc.ZoomSearch.NamedSource} sources
 */
nyc.ZoomSearch.prototype.addSources = function(sources){
	var me = this;
	me.sources = sources;
	$.each(sources, function(_, src){
		var cls = me.cssClass(src), li = $('<li class="ui-li-static ui-body-inherit">' + src.name + '</li>');
		li.click(function(){
			me.setSourceList(cls);
		});
		$('#mnu-srch-typ').append(li);
		$('li.' + cls).remove();
		me.addFeatures(src);
	});
	me.setListCss();
};

/**
 * Set or get the value of the search field 
 * @export
 * @param {string|undefined} val
 */
nyc.ZoomSearch.prototype.val = function(val){
	if (val) $('#fld-srch-container input').val(val);
	return 	$('#fld-srch-container input').val();
};

/**
 * Displays possible address matches 
 * @export
 * @param {Array.<string>} possibleValues
 */
nyc.ZoomSearch.prototype.disambiguate = function(possibleValues){
	var me = this;
	if (possibleValues.length){
		$.each(possibleValues, function(i, p){
			var coords = p.coordinates,
				li = $('<li class="ui-li-static ui-body-inherit srch-type-addr">' + p.name + '</li>'),
				cls = me.cssClass({name: p.name + coords[0] + coords[1]});
			$('li.' + cls).remove();
			li.addClass(cls);
			li.possible = p; //TODO: hack for now - more lipstick on the pig
			$('#fld-srch-retention').append(li);
			li.click(function(){
				me.val(p.name);
				$(me).trigger('disambiguated', li.possible);
				li.parent().slideUp();
			});
		});
		me.setSourceList('srch-type-addr', true);
		$('#fld-srch').slideDown();
	}
};

/**
 * Object type to set options on nyc.ZoomSearch
 * @typedef {Object}
 * @property {string} name
 * @property {nyc.UpkList} source 
 */
nyc.ZoomSearch.NamedSource;

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ZoomSearch.HTML = 
	'<div id="fld-srch-container" class="ctl">' +
		'<ul id="mnu-srch-typ" class="ctl ui-corner-all" data-role="listview">' + 
		'<li id="srch-by">Search by...</li>' +
		'<li id="srch-type-addr">Address, intersetion, ZIP Code, etc.</li>' +
		'</ul>' +
		'<ul id="fld-srch" class="ui-corner-all" data-role="listview" data-filter="true" data-filter-reveal="true" data-filter-placeholder="Search for an address..."></ul>' +
		'<a id="btn-srch-typ" class="ui-btn ui-icon-carat-d ui-btn-icon-notext" title="Search Type">Search Type</a>' +
	'</div>' +
	'<a id="btn-z-in" class="ctl ctl-btn" data-role="button" data-icon="plus" data-iconpos="notext" data-zoom-incr="1" title="Zoom in">' +
		'<span class="noshow">Zoom in</span>' +
	'</a>' +
	'<a id="btn-z-out" class="ctl ctl-btn" data-role="button" data-icon="minus" data-iconpos="notext" data-zoom-incr="-1" title="Zoom out">' +
		'Zoom out' +
	'</a>' +
	'<ul id="fld-srch-retention"></ul>';
