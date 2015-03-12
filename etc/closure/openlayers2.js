/**
 * @fileoverview Externs for OpenLayers 2.x.
 * @externs
 */
var OpenLayers = {};


/**
 * @type {Object.<string, number>}
 */
OpenLayers.INCHES_PER_UNIT;

/**
 * @type {number}
 */
OpenLayers.METERS_PER_INCH;

/**
 * @param {number=} opt_leftOrArray
 * @param {number=} opt_bottom
 * @param {number=} opt_right
 * @param {number=} opt_top
 * @constructor
 */
OpenLayers.Bounds = function(opt_leftOrArray, opt_bottom, opt_right, opt_top) {};

/**
 * @type {number}
 */
OpenLayers.Bounds.prototype.bottom;

/**
 * @type {number}
 */
OpenLayers.Bounds.prototype.left;

/**
 * @type {number}
 */
OpenLayers.Bounds.prototype.right;

/**
 * @type {number}
 */
OpenLayers.Bounds.prototype.top;

/**
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Bounds.prototype.clone = function() {};

/**
 * @param {number} x
 * @param {number} y
 * @param {boolean=} opt_inclusive
 * @return boolean
 */
OpenLayers.Bounds.prototype.contains = function(x, y, opt_inclusive) {};

/**
 * @param {OpenLayers.Bounds} bounds
 * @param {boolean=} opt_partial
 * @param {boolean=} opt_inclusive
 * @return boolean
 */
OpenLayers.Bounds.prototype.containsBounds = function(bounds, opt_partial, opt_inclusive) {};

/**
 * @param {OpenLayers.LonLat} lonLat
 * @param {Object=} opt_options
 * @return boolean
 */
OpenLayers.Bounds.prototype.containsLonLat = function(lonLat, opt_options) {};

/**
 * @param {OpenLayers.LonLat|OpenLayers.Geometry.Point|OpenLayers.Bounds} obj
 */
OpenLayers.Bounds.prototype.extend = function(obj) {};

/**
 * @return {OpenLayers.LonLat}
 */
OpenLayers.Bounds.prototype.getCenterLonLat = function() {};

/**
 * @return {number}
 */
OpenLayers.Bounds.prototype.getHeight = function() {};

/**
 * @return {number}
 */
OpenLayers.Bounds.prototype.getWidth = function() {};

/**
 * @param {OpenLayers.Bounds} bounds
 * @param {Object=} opt_options
 * @return boolean
 */
OpenLayers.Bounds.prototype.intersectsBounds = function(bounds, opt_options) {};

/**
 * @param {number} ratio
 * @param {(OpenLayers.LonLat|OpenLayers.Pixel)=} opt_origin
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Bounds.prototype.scale = function(ratio, opt_origin) {};

/**
 * @param {number=} opt_decimal
 * @param {boolean=} opt_reverseAxisOrder
 * @return {string}
 */
OpenLayers.Bounds.prototype.toBBOX = function(opt_decimal, opt_reverseAxisOrder) {};

/**
 * @return {string}
 */
OpenLayers.Bounds.prototype.toString = function() {};

/**
 * @param {OpenLayers.Projection|string} source
 * @param {OpenLayers.Projection|string} dest
 */
OpenLayers.Bounds.prototype.transform = function(source, dest) {};

/**
 * @param {Function} parentClass
 * @param {Object} definition
 * @constructor
 */
OpenLayers.Class = function(parentClass, definition) {};

/**
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Control = function(opt_options) {};

/**
 * @type {OpenLayers.Events}
 */
OpenLayers.Control.prototype.events;

/**
 * @type {OpenLayers.Handler}
 */
OpenLayers.Control.prototype.handler;

/**
 * @type {Object}
 */
OpenLayers.Control.prototype.handlerOptions;

/**
 */
OpenLayers.Control.prototype.activate = function() {};

/**
 */
OpenLayers.Control.prototype.deactivate = function() {};

/**
 * @param {Object=} opt_options
 */
OpenLayers.Control.prototype.initialize = function(opt_options) {};

/**
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.ArgParser = function() {};

/**
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Attribution = function() {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Button = function(opt_options) {};

/**
 * @param {function (new:OpenLayers.Handler, (OpenLayers.Control|null), (Object|null), (Object|null)): ?} handler
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Measure = function(handler, opt_options) {};

/**
 * @param {OpenLayers.Geometry} geometry
 * @return {Array.<(number|string)>}
 */
OpenLayers.Control.Measure.prototype.getBestLength = function(geometry) {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.MousePosition = function(opt_options) {};

/**
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Navigation = function() {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Panel = function(opt_options) {};

/**
 * @param {Array.<OpenLayers.Control>} controls
 */
OpenLayers.Control.Panel.prototype.addControls = function(controls) {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Permalink = function(opt_options) {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.ScaleLine = function(opt_options) {};

/**
 * @param {OpenLayers.Layer.Vector|Array.<OpenLayers.Layer.Vector>} layers
 * @param {Object} options
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.SelectFeature = function(layers, options) {};

/**
 * @param {OpenLayers.Layer.Vector|Array.<OpenLayers.Layer.Vector>} layers
 */
OpenLayers.Control.SelectFeature.prototype.setLayer = function(layers) {};

/**
 * @param {Object=} opt_options
 */
OpenLayers.Control.SelectFeature.prototype.unselectAll = function(opt_options) {};

/**
 * @extends {OpenLayers.Control}
 * @constructor
 */
OpenLayers.Control.Zoom = function() {};

OpenLayers.Event = {};

/**
 * @param {OpenLayers.EventObject} evt
 */
OpenLayers.Event.stop = function(evt) {};

/**
 * Event object, which is not typed in OL.
 * @constructor
 */
OpenLayers.EventObject = function() {};

/**
 * @type {OpenLayers.Feature.Vector}
 */
OpenLayers.EventObject.prototype.feature;

/**
 * @type {Array.<OpenLayers.Feature.Vector>}
 */
OpenLayers.EventObject.prototype.features;

/**
 * @type {number}
 */
OpenLayers.EventObject.prototype.measure;

/**
 * @type {number}
 */
OpenLayers.EventObject.prototype.order;

/**
 * @type {Object}
 */
OpenLayers.EventObject.prototype.target;

/**
 * @type {string}
 */
OpenLayers.EventObject.prototype.units;

/**
 * @type {OpenLayers.Pixel}
 */
OpenLayers.EventObject.prototype.xy;

/**
 * @constructor
 */
OpenLayers.Events = function() {};

/**
 * @param {Object} object
 */
OpenLayers.Events.prototype.on = function(object) {};

/**
 * @param {string} type
 * @param {Object} obj
 * @param {function(OpenLayers.EventObject=)} func
 * @param {boolean=} opt_priority
 */
OpenLayers.Events.prototype.register = function(type, obj, func, opt_priority) {};

/**
 * @param {OpenLayers.Layer} layer
 * @param {OpenLayers.LonLat} lonlat
 * @param {Object} data
 * @constructor
 */
OpenLayers.Feature = function(layer, lonlat, data) {};

/**
 * @type {Object}
 */
OpenLayers.Feature.prototype.attributes;

/**
 * @type {OpenLayers.Marker}
 */
OpenLayers.Feature.prototype.marker;

/**
 * @param {OpenLayers.Geometry} geometry
 * @param {Object=} opt_attributes
 * @param {Object=} opt_style
 * @extends {OpenLayers.Feature}
 * @constructor
 */
OpenLayers.Feature.Vector = function(geometry, opt_attributes, opt_style) {};

/**
 * @type {Object}
 */
OpenLayers.Feature.Vector.prototype.attributes;

/**
 * @type {Array.<OpenLayers.Feature.Vector>}
 */
OpenLayers.Feature.Vector.prototype.cluster;

/**
 * @type {OpenLayers.Geometry}
 */
OpenLayers.Feature.Vector.prototype.geometry;

/**
 * @type {Object}
 */
OpenLayers.Feature.Vector.style;

/**
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Filter = function(opt_options) {};

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Filter}
 */
OpenLayers.Filter.Comparison = function(opt_options) {};


/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.EQUAL_TO;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.NOT_EQUAL_TO;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.LESS_THAN;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.GREATER_THAN;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.BETWEEN;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.LIKE;

/**
 * @type {number}
 */
OpenLayers.Filter.Comparison.prototype.lowerBoundary;

/**
 * @type {boolean}
 */
OpenLayers.Filter.Comparison.prototype.matchCase;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.prototype.property;

/**
 * @type {string}
 */
OpenLayers.Filter.Comparison.prototype.type;

/**
 * @type {number}
 */
OpenLayers.Filter.Comparison.prototype.upperBoundary;

/**
 * @type {(number|string)}
 */
OpenLayers.Filter.Comparison.prototype.value;

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Filter}
 */
OpenLayers.Filter.Function = function(opt_options) {};

/**
 * @type {string}
 */
OpenLayers.Filter.Function.prototype.name;

/**
 * @type {Array.<(OpenLayers.Filter.Function|string|number)>}
 */
OpenLayers.Filter.Function.prototype.params;

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Filter}
 */
OpenLayers.Filter.Logical = function(opt_options) {};

/**
 * @type {string}
 */
OpenLayers.Filter.Logical.AND;

/**
 * @type {string}
 */
OpenLayers.Filter.Logical.OR;

/**
 * @type {string}
 */
OpenLayers.Filter.Logical.NOT;

/**
 * @type {Array.<OpenLayers.Filter>}
 */
OpenLayers.Filter.Logical.prototype.filters;

/**
 * @type {string}
 */
OpenLayers.Filter.Logical.prototype.type;

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Filter}
 */
OpenLayers.Filter.Spatial = function(opt_options) {};

/**
 * @constructor
 */
OpenLayers.Format = function() {};

/**
 * @constructor
 * @extends {OpenLayers.Format}
 */
OpenLayers.Format.CQL = function() {};

/**
 * @param {string} source
 * @return {OpenLayers.Filter}
 */
OpenLayers.Format.CQL.prototype.read = function(source) {};

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Format.XML.VersionedOGC}
 */
OpenLayers.Format.WMTSCapabilities = function(opt_options) {};

/**
 * @param {(Document|Element|string)} data
 * @return {Object} 
 */
OpenLayers.Format.WMTSCapabilities.prototype.read = function(data) {};

/**
 * @param {Object} capabilities
 * @param {Object} config
 * @return {OpenLayers.Layer.WMTS} 
 */
OpenLayers.Format.WMTSCapabilities.prototype.createLayer = function(capabilities, config) {};

/**
 * @constructor
 * @extends {OpenLayers.Format}
 */
OpenLayers.Format.XML = function() {};

/**
 * @constructor
 * @extends {OpenLayers.Format.XML}
 */
OpenLayers.Format.XML.VersionedOGC = function() {};

/**
 * @constructor
 */
OpenLayers.Geometry = function() {};

/**
 * @type {string}
 */
OpenLayers.Geometry.prototype.CLASS_NAME;

/**
 * @return {OpenLayers.Geometry}
 */
OpenLayers.Geometry.prototype.clone = function() {};

/**
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Geometry.prototype.getBounds = function() {};

/**
 * @return {OpenLayers.Geometry.Point}
 */
OpenLayers.Geometry.prototype.getCentroid = function() {};

/**
 * @return {string}
 */
OpenLayers.Geometry.prototype.toString = function() {};

/**
 * @param {Array.<OpenLayers.Geometry>} components
 * @extends {OpenLayers.Geometry}
 * @constructor
 */
OpenLayers.Geometry.Collection = function(components) {};

/**
 * @type {Array.<OpenLayers.Geometry>}
 */
OpenLayers.Geometry.Collection.prototype.components;

/**
 * @param {Array.<OpenLayers.Geometry.Point>} point
 * @extends {OpenLayers.Geometry.MultiPoint}
 * @constructor
 */
OpenLayers.Geometry.Curve = function(point) {};

/**
 * @param {Array.<OpenLayers.Geometry.Point>} points
 * @extends {OpenLayers.Geometry.LineString}
 * @constructor
 */
OpenLayers.Geometry.LinearRing = function(points) {};

/**
 * @param {OpenLayers.Geometry.Point} point
 * @return {number|boolean}
 */
OpenLayers.Geometry.LinearRing.prototype.containsPoint = function(point) {};

/**
 * @param {Array.<OpenLayers.Geometry.Point>} points
 * @extends {OpenLayers.Geometry.Curve}
 * @constructor
 */
OpenLayers.Geometry.LineString = function(points) {};

/**
 * @param {Array.<OpenLayers.Geometry.Point>} components
 * @extends {OpenLayers.Geometry.Collection}
 * @constructor
 */
OpenLayers.Geometry.MultiPoint = function(components) {};

/**
 * @param {Array.<OpenLayers.Geometry.Polygon>} components
 * @extends {OpenLayers.Geometry.Collection}
 * @constructor
 */
OpenLayers.Geometry.MultiPolygon = function(components) {};

/**
 * @param {number} x
 * @param {number} y
 * @extends {OpenLayers.Geometry}
 * @constructor
 */
OpenLayers.Geometry.Point = function(x, y) {};

/**
 * @type {number}
 */
OpenLayers.Geometry.Point.prototype.x;

/**
 * @type {number}
 */
OpenLayers.Geometry.Point.prototype.y;

/**
 * @return {string}
 */
OpenLayers.Geometry.Point.prototype.toShortString = function() {};

/**
 * @param {OpenLayers.Projection} source
 * @param {OpenLayers.Projection} dest
 * @return {string}
 */
OpenLayers.Geometry.Point.prototype.transform = function(source, dest) {};

/**
 * @param {Array.<OpenLayers.Geometry.LinearRing>} rings
 * @extends {OpenLayers.Geometry.Collection}
 * @constructor
 */
OpenLayers.Geometry.Polygon = function(rings) {};

/**
 * @param {OpenLayers.Geometry.Point} point
 * @return {number|boolean}
 */
OpenLayers.Geometry.Polygon.prototype.containsPoint = function(point) {};

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Handler = function(control, callbacks, opt_options) {};

/**
 * @type {number}
 */
OpenLayers.Handler.MOD_CTRL;

/**
 * @type {number}
 */
OpenLayers.Handler.MOD_SHIFT;

/**
 * @return {boolean} 
 */
OpenLayers.Handler.prototype.activate = function() {};

/**
 * @return {boolean} 
 */
OpenLayers.Handler.prototype.deactivate = function() {};

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler}
 * @constructor
 */
OpenLayers.Handler.Box = function(control, callbacks, options) {};

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler}
 * @constructor
 */
OpenLayers.Handler.Click = function(control, callbacks, options) {};

/**
 * @param {OpenLayers.Control} control
 * @param {OpenLayers.Layer.Vector} layer
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler}
 * @constructor
 */
OpenLayers.Handler.Feature = function(control, layer, callbacks, options) {};

/**
 * @type {boolean}
 */
OpenLayers.Handler.Feature.prototype.stopDown;

/**
 * @type {boolean}
 */
OpenLayers.Handler.Feature.prototype.stopUp;

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler.Point}
 * @constructor
 */
OpenLayers.Handler.Path = function(control, callbacks, options) {};

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler}
 * @constructor
 */
OpenLayers.Handler.Point = function(control, callbacks, options) {};

/**
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object} options
 * @extends {OpenLayers.Handler}
 * @constructor
 */
OpenLayers.Handler.Polygon = function(control, callbacks, options) {};

/**
 * @param {string} url
 * @param {OpenLayers.Size|Object} size
 * @param {OpenLayers.Pixel|Object} offset
 * @param {Function} calculateOffset
 * @constructor
 */
OpenLayers.Icon = function(url, size, offset, calculateOffset) {};

/**
 * @constructor
 */
OpenLayers.Layer = function() {};

/**
 * @type {boolean}
 */
OpenLayers.Layer.prototype.displayInLayerSwitcher;

/**
 * @type {OpenLayers.Events}
 */
OpenLayers.Layer.prototype.events;

/**
 * @type {boolean}
 */
OpenLayers.Layer.prototype.isBaseLayer;

/**
 * @type {OpenLayers.Map}
 */
OpenLayers.Layer.prototype.map;

/**
 * @type {number}
 */
OpenLayers.Layer.prototype.minResolution;

/**
 * @type {string}
 */
OpenLayers.Layer.prototype.name;

/**
 * @type {number}
 */
OpenLayers.Layer.prototype.opacity;

/**
 * @type {Object}
 */
OpenLayers.Layer.prototype.options;

/**
 * @type {Array.<number>}
 */
OpenLayers.Layer.prototype.resolutions;

/**
 * @return {boolean}
 */
OpenLayers.Layer.prototype.getVisibility = function() {};

/**
 * @return {boolean}
 */
OpenLayers.Layer.prototype.redraw = function() {};

/**
 * @param {boolean} isBaseLayer
 */
OpenLayers.Layer.prototype.setIsBaseLayer = function(isBaseLayer) {};

/**
 * @param {number} opacity
 */
OpenLayers.Layer.prototype.setOpacity = function(opacity) {};

/**
 * @param {boolean} visible
 */
OpenLayers.Layer.prototype.setVisibility = function(visible) {};

/**
 * @param {string} name
 * @param {string} url
 * @param {Object=} opt_params
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer.Grid}
 * @constructor
 */
OpenLayers.Layer.ArcGIS93Rest = function(name, url, opt_params, opt_options) {};

/**
 * @param {OpenLayers.Bounds} bounds
 */
OpenLayers.Layer.ArcGIS93Rest.prototype.getURL = function(bounds) {};

/**
 * @type {string}
 * @override
 */
OpenLayers.Layer.ArcGIS93Rest.prototype.url;

/** 
 * @param {string} name 
 * @param {string} url 
 * @param {Object=} opt_options 
 * @extends {OpenLayers.Layer.Grid} 
 * @constructor 
 */ 
OpenLayers.Layer.ArcGISCache = function(name, url, opt_options) {};

/**
 * @param {string|undefined} title
 * @param {Object|undefined} options
 * @extends {OpenLayers.Layer}
 * @constructor
 */
OpenLayers.Layer.Google = function(title, options) {};

/**
 * @type {number}
 */
OpenLayers.Layer.Google.prototype.maxZoomLevel;

/**
 * @type {number}
 */
OpenLayers.Layer.Google.prototype.numZoomLevels;

/**
 * @param {string} title
 * @param {string} url
 * @param {Object=} opt_params
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer.HTTPRequest}
 * @constructor
 */
OpenLayers.Layer.Grid = function(title, url, opt_params, opt_options) {};

/**
 * @param {string} title
 * @param {string} url
 * @param {Object=} opt_params
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer}
 * @constructor
 */
OpenLayers.Layer.HTTPRequest = function(title, url, opt_params, opt_options) {};

/**
 * @type {Object}
 */
OpenLayers.Layer.HTTPRequest.prototype.params;

/**
 * @type {string|Array.<string>}
 */
OpenLayers.Layer.HTTPRequest.prototype.url;

/**
 * @param {Object} newParams
 */
OpenLayers.Layer.HTTPRequest.prototype.mergeNewParams = function(newParams) {};

/**
 * @param {Object=} opt_newParams
 * @param {string=} opt_altUrl
 */
OpenLayers.Layer.HTTPRequest.prototype.getFullRequestString = function(opt_newParams, opt_altUrl) {};

/**
 * @param {string=} opt_title
 * @param {string|Array.<string>=} opt_tiles
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer.XYZ}
 * @constructor
 */
OpenLayers.Layer.OSM = function(opt_title, opt_tiles, opt_options) {};

/**
 * @param {string} title
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer}
 * @constructor
 */
OpenLayers.Layer.Vector = function(title, opt_options) {};

/**
 * @type {Array.<OpenLayers.Feature.Vector>}
 */
OpenLayers.Layer.Vector.prototype.features;

/**
 * @type {Array.<string>}
 */
OpenLayers.Layer.Vector.prototype.renderers;

/**
 * @type {Array.<OpenLayers.Feature.Vector>}
 */
OpenLayers.Layer.Vector.prototype.selectedFeatures;

/**
 * @type {Array.<OpenLayers.Strategy>}
 */
OpenLayers.Layer.Vector.prototype.strategies;

/**
 * @type {OpenLayers.StyleMap}
 */
OpenLayers.Layer.Vector.prototype.styleMap;

/**
 * @param {Array.<OpenLayers.Feature.Vector>|OpenLayers.Feature.Vector} features
 */
OpenLayers.Layer.Vector.prototype.addFeatures = function(features) {};

/**
 * @param {string} featureId
 * @return {OpenLayers.Feature.Vector}
 */
OpenLayers.Layer.Vector.prototype.getFeatureById = function(featureId) {};

/**
 */
OpenLayers.Layer.Vector.prototype.removeAllFeatures = function() {};

/**
 * @param {Array.<OpenLayers.Feature.Vector>} features
 * @param {Object=} opt_options
 */
OpenLayers.Layer.Vector.prototype.removeFeatures = function(features, opt_options) {};

/**
 * @param {string} title
 * @param {string} url
 * @param {Object=} opt_params
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer.Grid}
 * @constructor
 */
OpenLayers.Layer.WMS = function(title, url, opt_params, opt_options) {};

/**
 * @param {Object} config
 * @extends {OpenLayers.Layer.Grid}
 * @constructor
 */
OpenLayers.Layer.WMTS = function(config) {};

/**
 * @param {string} title
 * @param {string} url
 * @param {Object=} opt_options
 * @extends {OpenLayers.Layer.Grid}
 * @constructor
 */
OpenLayers.Layer.XYZ = function(title, url, opt_options) {};

/**
 * @param {number} lon
 * @param {number} lat
 * @constructor
 */
OpenLayers.LonLat = function(lon, lat) {};

/**
 * @param {string} str
 * @return {OpenLayers.LonLat}
 */
OpenLayers.LonLat.fromString = function(str) {};

/**
 * @type {number}
 */
OpenLayers.LonLat.prototype.lon;

/**
 * @type {number}
 */
OpenLayers.LonLat.prototype.lat;

/**
 * @return {OpenLayers.LonLat}
 */
OpenLayers.LonLat.prototype.clone = function() {};

/**
 * @param {OpenLayers.LonLat} that
 * @return {boolean}
 */
OpenLayers.LonLat.prototype.equals = function(that) {};

/**
 * @return {string}
 */
OpenLayers.LonLat.prototype.toShortString = function() {};

/**
 * @param {OpenLayers.Projection} source
 * @param {OpenLayers.Projection} dest
 */
OpenLayers.LonLat.prototype.transform = function(source, dest) {};

/**
 * @param {string} div
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Map = function(div, opt_options) {};

/**
 * @type {OpenLayers.Layer}
 */
OpenLayers.Map.prototype.baseLayer;

/**
 * @type {Array.<OpenLayers.Control>}
 */
OpenLayers.Map.prototype.controls;

/**
 * @type {OpenLayers.Events}
 */
OpenLayers.Map.prototype.events;

/**
 * @type {Array.<OpenLayers.Layer>}
 */
OpenLayers.Map.prototype.layers;

/**
 * @type {Array.<OpenLayers.Popup>}
 */
OpenLayers.Map.prototype.popups;

/**
 * @type {string}
 */
OpenLayers.Map.prototype.projection;

/**
 * @type {number}
 */
OpenLayers.Map.prototype.zoom;

/**
 * @param {OpenLayers.Control} control
 */
OpenLayers.Map.prototype.addControl = function(control) {};

/**
 * @param {OpenLayers.Layer} layer
 */
OpenLayers.Map.prototype.addLayer = function(layer) {};

/**
 * @param {Array.<OpenLayers.Layer>} layers
 */
OpenLayers.Map.prototype.addLayers = function(layers) {};

/**
 * @param {OpenLayers.Popup} popup
 * @param {boolean=} opt_exclusive
 */
OpenLayers.Map.prototype.addPopup = function(popup, opt_exclusive) {};

/**
 * @return {OpenLayers.LonLat}
 */
OpenLayers.Map.prototype.getCenter = function() {};

/**
 * @param {string} property
 * @param {string|Object} match
 * @return {Array.<OpenLayers.Control>}
 */
OpenLayers.Map.prototype.getControlsBy = function(property, match) {};

/**
 * @param {string|Object} match
 * @return {Array.<OpenLayers.Control>}
 */
OpenLayers.Map.prototype.getControlsByClass = function(match) {};

/**
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Map.prototype.getExtent = function() {};

/**
 * @param {string} property
 * @param {string|Object} match
 * @return {Array.<OpenLayers.Layer>}
 */
OpenLayers.Map.prototype.getLayersBy = function(property, match) {};

/**
 * @param {string|Object} match
 * @return {Array.<OpenLayers.Layer>}
 */
OpenLayers.Map.prototype.getLayersByClass = function(match) {};

/**
 * @param {OpenLayers.Pixel} px
 * @return {OpenLayers.LonLat}
 */
OpenLayers.Map.prototype.getLonLatFromPixel = function(px) {};

/**
 * @return {number}
 */
OpenLayers.Map.prototype.getNumZoomLevels = function() {};

/**
 * @return {OpenLayers.Projection}
 */
OpenLayers.Map.prototype.getProjectionObject = function() {};

/**
 * @return {number}
 */
OpenLayers.Map.prototype.getResolution = function() {};

/**
 * @param {number} zoom
 * @return {?number}
 */
OpenLayers.Map.prototype.getResolutionForZoom = function(zoom) {};

/**
 * @return {number}
 */
OpenLayers.Map.prototype.getScale = function() {};

/**
 * @return {OpenLayers.Size}
 */
OpenLayers.Map.prototype.getSize = function() {};

/**
 * @return {?string}
 */
OpenLayers.Map.prototype.getUnits = function() {};

/**
 * @return {number}
 */
OpenLayers.Map.prototype.getZoom = function() {};

/**
 * @param {OpenLayers.Bounds} bounds
 * @param {boolean=} opt_closest
 * @return {?number}
 */
OpenLayers.Map.prototype.getZoomForExtent = function(bounds, opt_closest) {};

/**
 * @param {number} resolution
 * @param {boolean=} opt_closest
 * @return {?number}
 */
OpenLayers.Map.prototype.getZoomForResolution = function(resolution, opt_closest) {};

/**
 * @param {OpenLayers.LonLat} lonlat
 */
OpenLayers.Map.prototype.panTo = function(lonlat) {};

/**
 * @param {OpenLayers.Control} control
 */
OpenLayers.Map.prototype.removeControl = function(control) {};

/**
 * @param {OpenLayers.Layer} layer
 */
OpenLayers.Map.prototype.removeLayer = function(layer) {};

/**
 * @param {OpenLayers.Popup} popup
 */
OpenLayers.Map.prototype.removePopup = function(popup) {};

/**
 * @param {OpenLayers.Layer} newBaseLayer
 */
OpenLayers.Map.prototype.setBaseLayer = function(newBaseLayer) {};

/**
 * @param {OpenLayers.LonLat} center
 * @param {number=} opt_zoom
 * @param {boolean=} opt_dragging
 * @param {boolean=} opt_forceZoomChange
 */
OpenLayers.Map.prototype.setCenter = function(center, opt_zoom, opt_dragging, opt_forceZoomChange) {};

/**
 */
OpenLayers.Map.prototype.updateSize = function() {};

/**
 * @param {OpenLayers.Bounds|Array.<number>} bounds
 * @param {boolean=} opt_closest
 */
OpenLayers.Map.prototype.zoomToExtent = function(bounds, opt_closest) {};

/**
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Icon} icon
 * @constructor
 */
OpenLayers.Marker = function(lonlat, icon) {};

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
OpenLayers.Pixel = function(x,y) {};

/**
 * @param {number} x
 * @param {number} y
 * @return {OpenLayers.Pixel}
 */
OpenLayers.Pixel.prototype.add = function(x,y) {};

/**
 * @param {?string} id
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Size} size
 * @param {string} contentHTML
 * @param {boolean} closeBox
 * @param {Function=} opt_closeBoxCallback
 * @constructor
 */
OpenLayers.Popup = function(id, lonlat, size, contentHTML, closeBox, opt_closeBoxCallback) {};

/**
 * @type {boolean}
 */
OpenLayers.Popup.prototype.autoSize;

/**
 * @param {?string} id
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Size} size
 * @param {string} contentHTML
 * @param {Object} anchor
 * @param {boolean} closeBox
 * @param {Function=} opt_closeBoxCallback
 * @constructor
 * @extends {OpenLayers.Popup}
 */
OpenLayers.Popup.Anchored = function(id, lonlat, size, contentHTML, anchor, closeBox, opt_closeBoxCallback) {};

/**
 * @param {?string} id
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Size} size
 * @param {string} contentHTML
 * @param {Object} anchor
 * @param {boolean} closeBox
 * @param {Function=} opt_closeBoxCallback
 * @constructor
 * @extends {OpenLayers.Popup.Anchored}
 */
OpenLayers.Popup.AnchoredBubble = function(id, lonlat, size, contentHTML, anchor, closeBox, opt_closeBoxCallback) {};

/**
 * @param {?string} id
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Size} size
 * @param {string} contentHTML
 * @param {Object} anchor
 * @param {boolean} closeBox
 * @param {Function=} opt_closeBoxCallback
 * @constructor
 * @extends {OpenLayers.Popup.Anchored}
 */
OpenLayers.Popup.Framed = function(id, lonlat, size, contentHTML, anchor, closeBox, opt_closeBoxCallback) {};

/**
 * @param {?string} id
 * @param {OpenLayers.LonLat} lonlat
 * @param {OpenLayers.Size} size
 * @param {string} contentHTML
 * @param {Object} anchor
 * @param {boolean} closeBox
 * @param {Function=} opt_closeBoxCallback
 * @constructor
 * @extends {OpenLayers.Popup.Framed}
 */
OpenLayers.Popup.FramedCloud = function(id, lonlat, size, contentHTML, anchor, closeBox, opt_closeBoxCallback) {};

/**
 * @param {string} epsg
 * @constructor
 */
OpenLayers.Projection = function(epsg) {};

/**
 * @type {Object}
 */
OpenLayers.Projection.defaults;

/**
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Protocol = function(opt_options) {};

/**
 * @param {Object=} opt_options
 */
OpenLayers.Protocol.prototype.read = function(opt_options) {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Protocol}
 * @constructor
 */
OpenLayers.Protocol.WFS = function(opt_options) {};

/**
 * @param {Object=} opt_options
 * @extends {OpenLayers.Protocol}
 * @constructor
 */
OpenLayers.Protocol.Script = function(opt_options) {};

/**
 * @type {string}
 */
OpenLayers.ProxyHost;

/**
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Rule = function(opt_options) {};

/**
 * @param {number} w
 * @param {number} h
 * @constructor
 */
OpenLayers.Size = function(w,h) {};

/**
 * @type {number}
 */
OpenLayers.Size.prototype.h;

/**
 * @type {number}
 */
OpenLayers.Size.prototype.w;

/**
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Strategy = function(opt_options) {};

/**
 */
OpenLayers.Strategy.prototype.activate = function() {};

/**
 * @param {OpenLayers.Layer.Vector} layer
 */
OpenLayers.Strategy.prototype.setLayer = function(layer) {};

/**
 * @extends {OpenLayers.Strategy}
 * @constructor
 */
OpenLayers.Strategy.BBOX = function() {};

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Strategy}
 */
OpenLayers.Strategy.Cluster = function(opt_options) {};

/**
 * @constructor
 * @extends {OpenLayers.Strategy}
 */
OpenLayers.Strategy.Fixed = function() {};

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Strategy}
 */
OpenLayers.Strategy.Refresh = function(opt_options) {};

/**
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Strategy}
 */
OpenLayers.Strategy.Save = function(opt_options) {};

/**
 * @param {Object=} opt_style
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Style = function(opt_style, opt_options) {};

/**
 * @type {Object}
 */
OpenLayers.Style.prototype.context;

/**
 * @param {Array.<OpenLayers.Rule>} rules
 */
OpenLayers.Style.prototype.addRules = function(rules) {};

/**
 * @param {Object=} opt_style
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.StyleMap = function(opt_style, opt_options) {};

/**
 * @type {Object.<string, OpenLayers.Style>}
 */
OpenLayers.StyleMap.prototype.styles;

/**
 * @param {OpenLayers.Layer} layer
 * @param {OpenLayers.Pixel} position
 * @param {OpenLayers.Bounds} bounds
 * @param {string} url
 * @param {OpenLayers.Size} size
 * @param {Object=} opt_options
 * @constructor
 */
OpenLayers.Tile = function(layer, position, bounds, url, size, opt_options) {};

/**
 * @type {OpenLayers.Layer}
 */
OpenLayers.Tile.prototype.layer;

/**
 * @param {OpenLayers.Layer} layer
 * @param {OpenLayers.Pixel} position
 * @param {OpenLayers.Bounds} bounds
 * @param {string} url
 * @param {OpenLayers.Size} size
 * @param {Object=} opt_options
 * @constructor
 * @extends {OpenLayers.Tile}
 */
OpenLayers.Tile.Image = function(layer, position, bounds, url, size, opt_options) {};

OpenLayers.Util = {};

/**
 * @param {Object} to
 * @param {Object} from
 * @return {Object}
 */
OpenLayers.Util.applyDefaults = function(to, from) {};

/**
 * @param {Object} destination
 * @param {Object} source
 * @return {Object}
 */
OpenLayers.Util.extend = function(destination, source) {};

/**
 * @param {string} url
 * @return {Object}
 */
OpenLayers.Util.getParameters = function(url) {};

/**
 * @param {number} scale
 * @param {string?} units
 * @return {number|undefined}
 */
OpenLayers.Util.getResolutionFromScale = function(scale, units) {};

/**
 * @param {number} resolution
 * @param {string?} units
 * @return {number}
 */
OpenLayers.Util.getScaleFromResolution = function(resolution, units) {};
