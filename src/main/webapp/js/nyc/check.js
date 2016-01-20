var nyc = nyc || {};

/**
 * @desc Provide inheritance functionality
 * @public
 * @static
 * @function
 * @param {Function} childCtor The child constructor
 * @param {Function} parentCtor The parent constructor
 */
nyc.inherits = function(childCtor, parentCtor){
	for (var member in parentCtor.prototype){
		if (!(member in childCtor.prototype)){
			childCtor.prototype[member] = parentCtor.prototype[member];
		}
	}
};

/**
 * @desc Class to provide event handling functionality
 * @public
 * @class
 * @constructor
 */
nyc.EventHandling = function(){};

nyc.EventHandling.prototype = {
	/**
	 * @desc Connect a function to an event
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
	 */
    on: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope);
    },
	/**
	 * @desc Connect a function to an event for a single invocation
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
	 */
    one: function(eventName, evtHdlr, hdlrScope){
        this.addHdlr(eventName, evtHdlr, hdlrScope, true);
    },
	/**
	 * @desc Trigger a named event with event data
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to trigger
	 * @param {Object=} data The event data
	 */
    trigger: function(eventName, data){
        this.evtHdlrs = this.evtHdlrs || {};
        var handlers = this.evtHdlrs[eventName], remove = [];
		if (handlers){
            $.each(handlers, function(index, hdlr){
                if (hdlr.scope){
                    hdlr.handler.call(hdlr.scope, data);
                }else{
                	hdlr.handler(data);
                }
                if (hdlr.remove){
                	remove.push(hdlr);
                }
            });
            $.each(remove, function(_, hdlr){
            	handlers.splice($.inArray(hdlr, handlers), 1);
            });
        }
    },
	/**
	 * @desc Remove a previously connected event handler
	 * @public
	 * @method
	 * @param {string} eventName The name of the event to which the handler will be connected
	 * @param {function(Object)} evtHdlr The event handler function
	 * @param {Object=} hdlrScope The scope in which to invoke the event handler
	 */
    off: function(eventName, evtHdlr, hdlrScope){
        this.evtHdlrs = this.evtHdlrs || {};
        var handlers = this.evtHdlrs[eventName];
    	$.each(handlers, function(index, hdlr){
    		if (hdlr.handler === evtHdlr && hdlr.scope === hdlrScope){
    			handlers.splice(index, 1);
    			return false;
    		}
    	});
    },
	/**
	 * @private
	 * @method
	 * @param {string} eventName
	 * @param {function(Object)} evtHdlr
	 * @param {Object} hdlrScope
	 * @param {boolean} one
	 */
    addHdlr: function(eventName, evtHdlr, hdlrScope, one){
        this.evtHdlrs = this.evtHdlrs || {};
        this.evtHdlrs[eventName] = this.evtHdlrs[eventName] || [];
        this.evtHdlrs[eventName].push({handler: evtHdlr, scope: hdlrScope, remove: one});		    	
    }
};

/**
 * @desc Abstract collapsible control
 * @public
 * @class
 * @extends {nyc.EventHandling}
 * @constructor
 * @param {nyc.Collapsible.Options} options Constructor options
 */
nyc.Collapsible = function(options){
	var heading = $('<h3></h3>');

	this.currentVal = $('<span class="current-value"></span>');
	
	heading.html(options.title || '')
		.append(this.currentVal);
	
	$(options.target).prepend(heading)
		.collapsible()
		.collapsible('option', {collapsedIcon: 'carat-d', expandedIcon: 'carat-u'});
};

nyc.Collapsible.prototype = {
	/**
	 * @desc A JQuery element used to display a readable representation of the current value
	 * @public
	 * @member {JQuery}
	 */
	currentVal: null
};

nyc.inherits(nyc.Collapsible, nyc.EventHandling);

/**
 * @desc Collapsible choice control
 * @public
 * @abstract
 * @class
 * @extends {nyc.Collapsible}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Choice = function(options){
	var me = this, fieldset = $('<fieldset data-role="controlgroup"></fieldset>'), radio0;
	
	me.choices = options.choices;

	nyc.Choice.uniqueId++;
	
	me.inputs = [];
	$.each(me.choices, function(i, choice){
		var input = $('<input type="' + me.type + '">').uniqueId(),
			label = $('<label></label>');
		input.attr('name', 'nyc-radio-name' + '-' + nyc.Choice.uniqueId)
			.attr('value', i);
		if (i == 0){
			radio0 = input;
		}
		input.click($.proxy(me.changed, me));
		label.attr('for', input.attr('id')).html(choice.label);
		fieldset.append(input).append(label);
		me.inputs.push(input);
	});
		
	$(options.target).append(fieldset).trigger('create');

	nyc.Collapsible.apply(this, [options]);
};

nyc.Choice.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: null,
	/**
	 * @private
	 * @member {Array<Element>}
	 */
	inputs: null,
	/** 
	 * @public
	 * @abstract
	 * @method
	 * @param {Object} event The change event object 
	 */
	changed: function(event){
		throw 'Must be implemented';
	},
	/** 
	 * @desc Returns the value of the radio button collection
	 * @public
	 * @method
	 * @return {string|Array<string>} The value of the radio button collection
	 */
	val: function(){
		return this.value;
	},
	/** 
	 * @desc Enable/disable a radio button
	 * @public
	 * @method
	 * @param {string} choiceValue The value of the radio button to disable/enable
	 * @param {boolean} enabled The value of enabled
	 */
	disabled: function(choiceValue, disabled){
		var choiceIndex;
		$.each(this.choices, function(i, choice){
			if (choice.value == choiceValue){
				choiceIndex = i;
				return;
			}
		});
		$(this.inputs[choiceIndex]).prop('disabled', disabled).checkboxradio('refresh');
	}
};

nyc.inherits(nyc.Choice, nyc.Collapsible);

/** 
 * @desc Used to generate DOM ids
 * @public
 * @static {number}
 */
nyc.Choice.uniqueId = 0;

/**
 * @desc Collapsible checkbox collection
 * @public
 * @class
 * @extends {nyc.Choice}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Check = function(options){
	nyc.Choice.apply(this, [options]);
	$.each(this.inputs, function(_, input){
		$(input).prop('checked', true).checkboxradio('refresh');
	});
	this.changed();
};

nyc.Check.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: 'checkbox',
	/** 
	 * @public
	 * @method
	 * @param {Object} event The change event object 
	 */
	changed: function(event){
		var me = this, labels = [], values = [];
		$.each(me.inputs, function(_, input){
			if (input.prop('checked')){
				var choice = me.choices[input.val() * 1];
				labels.push(choice.label);
				values.push(choice.value);
			}
		});
		this.value = values;
		this.currentVal.html(labels.toString().replace(/,/, ', '));
		this.trigger('change', values);
	}		
};

nyc.inherits(nyc.Check, nyc.Choice);
