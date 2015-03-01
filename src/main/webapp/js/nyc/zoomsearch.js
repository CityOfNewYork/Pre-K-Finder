nyc.ZoomSearch = function(target, map){
	var me = this;
	me.map = map;
	$(target).append(nyc.ZoomSearch.HTML).trigger('create');
	me.typBtn = $('#btn-srch-typ');
	me.input = $('#fld-srch-container input');
	me.list = $('#fld-srch');
	me.typBtn.click($.proxy(me.chooseSource, me));
	me.input.on('keyup change', $.proxy(me.key, me));
	$('#btn-z-in, #btn-z-out').click($.proxy(me.zoom, me));
	$('#fld-srch-container .ui-input-clear').click(function(){
		me.list.hide();
	});
	$('#srch-type-addr').click(function(){
		me.setSourceList('srch-type-addr');
		me.val('');
		me.input.focus();
	});
	me.input.on('blur focus', function(e){
		if (e.type == 'focus'){
			me.typBtn.addClass('ctl-active');
			me.typBtn.removeClass('ui-icon-carat-u').addClass('ui-icon-carat-d');			
			$('#mnu-srch-typ').slideUp();
		}else{
			me.typBtn.removeClass('ctl-active');
		}
	});
};

nyc.ZoomSearch.prototype = {
	/** @private */
	map: null,
	/** @private */
	zoom: function(e){
		var map = this.map;
		map.zoomTo(map.getZoom() + ($(e.target).data('zoom-incr') * 1));
	},
	/** @private */
	key: function(e){
		this.typBtn[this.input.val().trim().length ? 'hide' : 'show']();
		if (e.keyCode == 13){
			this.search();
			this.list.slideUp();
		}else{
			this.list.slideDown();
		}
	},
	/** @private */
	search: function(){
		var input = this.input.val().trim();
		if (input.length)
			$(this).trigger('search', input, this);
	},
	/** @private */
	chooseSource: function(){
		$('#mnu-srch-typ').slideToggle();
		if (this.typBtn.hasClass('ui-icon-carat-d')){
			this.typBtn.removeClass('ui-icon-carat-d').addClass('ui-icon-carat-u');
		}else{
			this.typBtn.removeClass('ui-icon-carat-u').addClass('ui-icon-carat-d');			
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
		var plcHldr = cssClass == 'srch-type-addr' ? 'Search for an address...' : UPK_SEARCH_BY_PLACEHOLDER, name;
		$.each(this.sources, function(_, src){
			if (src.cssClass == cssClass) name = src.name;
		});
		this.list.filterable('option', 'filterPlaceholder', plcHldr);
		$('#fld-srch-retention').append($('#fld-srch li'));
		this.list.append($('li.' + cssClass));
		if (!noChoose) this.chooseSource();
	},
	/** @private */
	clone: function(feature){
		return new OpenLayers.Feature.Vector(
			new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y), 
			feature.attributes
		); 
	},
	/** @private */
	addFeatures: function(namedSource){
		var me = this, src = namedSource.source;
		$.each(src.features(), function(_, feature){
			var li = $('<li class="ui-li-static ui-body-inherit ui-screen-hidden ' + me.cssClass(namedSource) + '">' +
					'<img src="img/' + feature.type() + '0.png">' + feature.name() + '</li>');

			$('#fld-srch-retention').append(li);
			li.click(function(){
				me.val(feature.name());
				$(me).trigger('disambiguated', me.clone(feature));
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
			me.val('');
			me.input.focus();
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
	if (val) this.input.val(val);
	return 	this.input.val();
};

/**
 * Displays possible address matches 
 * @export
 * @param {Array.<string>} possibleValues
 */
nyc.ZoomSearch.prototype.disambiguate = function(possibleValues){
	var me = this;
	if (possibleValues.length){
		$.each(possibleValues, function(i, feature){
			var point = feature.geometry,
				name = feature.attributes.name,
				li = $('<li class="ui-li-static ui-body-inherit srch-type-addr">' + name + '</li>'),
				cls = me.cssClass({name: name + point.x + point.y});
			$('li.' + cls).remove();
			li.addClass(cls);
			$('#fld-srch-retention').append(li);
			li.click(function(){
				me.val(name);
				$(me).trigger('disambiguated', feature);
				li.parent().slideUp();
			});
		});
		me.setSourceList('srch-type-addr', true);
		me.list.slideDown();
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
