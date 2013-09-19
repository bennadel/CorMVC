
// Create a closed memory space for the application definition and instantiation.
// This way, we keep the global name space clean.
(function( $ ){
	
	// I am the class that controls the Javascript framework.
	function Application(){
		// Set default properties.
		
		// I am a unique ID of this application instance. NOTE: not currently used.
		this.id = ("app-" + (new Date()).getTime());
		
		// I am the locaion (URL) monitor timer interval and handle.
		this.locationMonitorInterval = null;
		this.locationMonitorDelay = 150;
		
		// I am the location frame that is use for IE6 browsers that do not properly
		// listen to the back button on the browser. NOTE: I am only added to the DOM
		// for IE6. 
		this.locationFrame = null;
		
		// I am the current location value of the application.
		this.currentLocation = null;
		
		// I am the collection of route mappings that map URL patterns to event 
		// handlers within the cached controllers.
		this.routeMappings = [];
		
		// I am the collection of controllers. All controllers are intended to be
		// singleton instances.
		this.controllers = [];
		
		// I am the collection of models. I can contain either cached singleton
		// instances or class definitions (to be instantiated at request).
		this.models = {
			cache: {},
			classes: {}
		};
		
		// I am the collection of views. I can contain either cached singleton
		// instances of class definitions (to be instantiated at request).
		this.views = {
			cache: {},
			classes: {}
		};
		
		
		
		
		// ?????????????????????????????????????????????????????????????????
		// ?????????????????????????????????????????????????????????????????
		// ?????????????????????????????????????????????????????????????????
		// ?????????????????????????????????????????????????????????????????
		this.locationEvent = null;
		
		
		
		
		// I bind myself (THIS) to the change event on the hash.
		$( this ).bind( "locationchange", this.proxyCallback( this.onLocationChange ) );
		
		// I am a flag to determine if the application has already started running.
		// I will determine if action is delayed or executed immediately when controllers
		// are registered.
		this.isRunning = false;
	};
		
		
	// I add a given class to the given cache or class repository.
	Application.prototype.addClass = function( target, value ){
		// Get the constructor of our value class.
		var constructor = value.constructor;
		
		// Check to see if this constructor is the Function object. If it is,
		// then this is just a class, not an instance.
		if (constructor == Function){
			
			// This value object is a class, not an instance. Therefore, we need
			// to get the name of the class from the function itself.
			var className = value.toString().match( new RegExp( "^function\\s+([^\\s\\(]+)", "i" ) )[ 1 ];
			
			// Cache the class constructor.
			target.classes[ className ] = value;
			
		} else {
		
			// This value object is an actual instance of the given class. Therefore,
			// we need to get the name of the class from its constructor function.
			var className = value.constructor.toString().match( new RegExp( "^function\\s+([^\\s\\(]+)", "i" ) )[ 1 ];
		
			// Cache the class constructor.
			target.classes[ className ] = value.constructor;
			
			// In addition to caching the class constructor, let's cache this instance 
			// of the given class itself (as it will act as a singleton).
			target.cache[ className ] = value;
			
			// Check to see if the application is running. If it is, then we need to initialize
			// the singleton instance.
			if (this.isRunning){
				this.initClass( value );
			}
			
		}
	};
		
		
	// I add the given controller to the collection of controllers.
	Application.prototype.addController = function( controller ){
		// Add the controller.
		this.controllers.push( controller );
		
		// Check to see if the application is running. If it is, then we need to initialize
		// the controller instance.
		if (this.isRunning){
			this.initClass( controller );
		}
	};
	
	
	// I add the given model class or instance to the model class library. Any classes
	// that are passed in AS instances will be cached and act as singletons.
	Application.prototype.addModel = function( model ){
		this.addClass( this.models, model );
	};
	
	
	// I add the given view class or instance to the view class library. Any classes
	// that are passed in AS instances will be cached and act as singletons.
	Application.prototype.addView = function( view ){
		this.addClass( this.views, view );
	};
	
	
	// I provide an AJAX gateway to the server.
	Application.prototype.ajax = function( options ){
		var self = this;
		
		// Get the full range of settings.
		var ajaxOptions = $.extend(
			{
				type: "get",
				dataType: "json",
				normalizeJSON: false,
				cache: false,
				timeout: (10 * 1000),
				success: function( response, statusText ){},
				error: function( request, statusText, error ){
					alert( "There was a critical error communicating with the server" );
				},
				complete: function( request, statusText ){}
			},
			options
		);
		
		// If the data type is JSON, override the success method with one that 
		// will normalize the response first.
		if (
			ajaxOptions.normalizeJSON &&
			(ajaxOptions.dataType == "json") &&
			options.success			
			){
		
			var targetSuccess = options.success;
		
			// Proxy the success callback, normalizing the response.
			ajaxOptions.success = function( response, statusText ){
				targetSuccess( self.normalizeJSON( response ) );
			};
		}
		
		// Make the AJAX call.
		$.ajax( ajaxOptions );	
	};
	
	
	// I check the location for a change.
	Application.prototype.checkLocationForChange = function(){
		// Grab the live location and clean it up. Remove any hash marks
		// as well as any leading or trailing slashes.
		var liveLocation = this.normalizeHash( window.location.hash );
			
		// Check to see if the location is not set or that it has changed
		// from the previous value.
		if (
			(this.currentLocation == null) ||
			(this.currentLocation != liveLocation)
			){
		
			// Update the iFrame location. This is needed to enable back button 
			// functionality in Internet Explorer (IE).
			if (this.locationFrame){
				this.locationFrame.attr( "src", "ie_back_button.htm?_=" + (new Date()).getTime() + "&hash=" + liveLocation );
			}
		
			// Set the current location.
			this.setLocation( liveLocation );
			
		}
	};
	
	
	// I return an instance of the class with the given name from the given target.
	Application.prototype.getClass = function( target, className, initArguments ){	
		// Check to see if the instance is a cached singleton.
		if (target.cache[ className ]){
		
			// This is a cached class - return the singleton.
			return( target.cache[ className ] );
		
		} else {
		
			// This is not a cached class - return a new instance. In order to
			// do that, we will have to create an instance of it and then
			// initialize it with the given arguments.
			var newInstance = new (target.classes[ className ])();
			
			// Initialize the class, this time calling the constructor in the 
			// context of the class instance.
			target.classes[ className ].apply( newInstance, initArguments );
			
			// Return the new instance.
			return( newInstance );
			
		}
	};
	
	
	// I am utility method used to create new DOM elements from templates.
	Application.prototype.getFromTemplate = function( template, model ){
		// Get the raw HTML from the template.
		var templateData = template.html();
		
		// Replace any data place holders with model data.
		templateData = templateData.replace(
			new RegExp( "\\$\\{([^\\}]+)\\}", "gi" ),
			function( $0, $1 ){
				// Check to see if the place holder corresponds to a model property.
				// If it does, replace it in.
				if ($1 in model){
					// Replace with model property.
					return( model[ $1 ] );
				} else {
					// Model property not found - just return what was already there.
					return( $0 )
				}
			}
		);
	
		// Create the new node, store the model data internall, and return 
		// the new node.
		return( $( templateData ).data( "model", model ) );
	};
	
	
	// I return an instance of the class with the given name.
	Application.prototype.getModel = function( className, initArguments ){
		return( this.getClass( this.models, className, initArguments ) );
	};
	
	
	// I return an instance of the class with the given name.
	Application.prototype.getView = function( className, initArguments ){
		return( this.getClass( this.views, className, initArguments ) );
	};
	
	
	// I initialize the given class instance.
	Application.prototype.initClass = function( instance ){
		// Check to see if the target instance has an init method.
		if (instance.init){
			// Invoke the init method.
			instance.init();
		}
	};
		
		
	// I intialize the given collection of class singletons.
	Application.prototype.initClasses = function( classes ){
		var self = this;
		
		// Loop over the given class collection - our singletons - and init them.
		$.each(
			classes,
			function( index, instance ){
				self.initClass( instance );
			}
		);
	};
	
	
	// I intialize the controllers. Once the application starts running and the
	// DOM can be interacted with, I need to give the controllers a chance to 
	// get ready.
	Application.prototype.initControllers = function(){
		this.initClasses( this.controllers );
	};
	
	
	// I set up the location monitor - preparing it for running. I should only
	// be called once. 
	Application.prototype.initLocationMonitor = function(){
		// We only want to do this for IE, to help fix the back button.
		if (document.all){
			this.locationFrame = $( "<iframe src=\"about:black\" style=\"display: none ;\" />" ).appendTo( document.body );
		}
	};
	
		
	// I intialize the model. Once the application starts running and the
	// DOM can be interacted with, I need to give the model a chance to 
	// get ready.
	Application.prototype.initModels = function(){
		this.initClasses( this.models.cache );
	};
	
	
	// I intialize the views. Once the application starts running and the
	// DOM can be interacted with, I need to give the views a chance to 
	// get ready.
	Application.prototype.initViews = function(){
		this.initClasses( this.views.cache );
	};
	
	
	// I am the logging method that will work cross-browser, if there is a
	// console or not. If no console is avilable, output simply gets appended
	// to the body of the page (in paragraph tags).
	Application.prototype.log = function(){
		// Check to see if there is a console to log to.
		if (window.console && window.console.log){
		
			// Use the built-in logger.
			window.console.log.apply( window.console, arguments );
		
		} else {
		
			// Output the page using P tags.
			$.each(
				arguments,
				function( index, value ){
					$( document.body ).append( "<p>" + value.toString() + "</p>" );
				}
			);
		
		}
	};
	
	
	// I normalize a hash value for comparison.
	Application.prototype.normalizeHash = function( hash ){
		// Strip off front hash and slashses as well as trailing slash. This will 
		// convert hash values like "#/section/" into "section".
		return(
			hash.replace( new RegExp( "^[#/]+|/$", "g" ), "" )
		);
	};
	
	
	// I normalize a JSON response from an AJAX call. This is because some languages
	// (such as ColdFusion) are not case sensitive and do not have proper casing
	// on their JSON translations. I will lowercase all keys.
	Application.prototype.normalizeJSON = function( object ){
		var self = this;
		
		// Check to see if this is an object that can be normalized.
		if (
			(typeof( object ) == "boolean") ||
			(typeof( object ) == "string") ||
			(typeof( object ) == "number") ||
			$.isFunction( object )
			){
			
			// This is a non-object, just return it's value.
			return( object );
		}
		
		// Check to see if this is an array.
		if ($.isArray( object )){
		
			// Create an array into which the normalized data will be stored.
			var normalizedObject = [];
			
			// Loop over the array value and moralize it's value.
			$.each(
				object,
				function( index, value ){
					normalizedObject[ index ] = self.normalizeJSON( value );
				}
			);
		
		} else {
		
			// Create an object into which the normalized data will be stored.
			var normalizedObject = {};
		
			// Loop over the object key and moralize it's key and value.
			$.each(
				object,
				function( key, value ){
					normalizedObject[ key.toLowerCase() ] = self.normalizeJSON( value );
				}
			);
			
		}
		
		// Return the normalized object.
		return( normalizedObject );
	};
	
	
	// I handle the location changes.
	Application.prototype.onLocationChange = function( locationChangeEvent ){
		var self = this;
		
		// I am used to determine if the application should continue routing the request.
		// Depending on the return value of a given event handler, the current routing
		// can be cancelled. 
		var keepRouting = true;
		
		// I am used to determine if a route was found for the given even. If not, a 
		// 404 - page not found route will be executed.
		var routeFound = false;
		
		// Turn off monitoring while we route the location. We are doing this
		// to allow the application time to process the route without being 
		// interupted. This will prevent someone clicking rappidly around the
		// application from causing unexpected effects.
		this.stopLocationMonitor();
		
		// Iterate over the route mappings.
		$.each(
			this.routeMappings,
			function( index, mapping ){
				var matches = null;
				
				// Check to see if routing has been cancelled.
				if (!keepRouting){
					return;
				}
			
				// Define the default event context. 
				var eventContext = {
					application: self,
					fromLocation: locationChangeEvent.fromLocation,
					toLocation: locationChangeEvent.toLocation,
					parameters: $.extend( {}, locationChangeEvent.parameters )
				};
				
				// Get the matches from the location (if the route mapping does 
				// not match, this will return null) and check to see if this route 
				// mapping applies to the current location (if no matches are returned,
				// matches array will be null).
				if (matches = locationChangeEvent.toLocation.match( mapping.test )){
					
					// The route mapping will handle this location change. Now, we
					// need to prepare the event context and invoke the route handler.
					
					// Remove the first array (the entire location match). This is 
					// irrelevant information. What we want are the captured groups 
					// which will be in the subsequent indices.
					matches.shift();
					
					// Map the captured group matches to the ordered parameters defined
					// in the route mapping.
					$.each(
						matches,
						function( index, value ){
							eventContext.parameters[ mapping.parameters[ index ] ] = value;
						}
					);
					
					// Check to see if this controller has a pre-handler.
					if (mapping.controller.preHandler){
						// Execute the pre-handler.
						mapping.controller.preHandler( eventContext );
					}
					
					// Execute the handler in the context of the controller. Even though the
					// event parameteres are getting passed as part of the event context, I
					// am going to pass them through as part of the argument collection for
					// conveinence in the handler's method signature.
					var result = mapping.handler.apply(
						mapping.controller,
						[ eventContext ].concat( matches )
					);
					
					// Check to see if this controller has a post-handler.
					if (mapping.controller.postHandler){
						// Execute the post-handler.
						mapping.controller.postHandler( eventContext );
					}
						
					// Check the controller handler's result value to see if we need to stop 
					// routing. If the controller returns false, we are going to stop routing.
					if (
						(typeof( result ) == "boolean") &&
						!result						
						){
						// Cancel routing.
						keepRouting = false;
					}
					
					// Flag that a route was found.
					routeFound = true;			
				}
			}
		);
		
		// Turn monitoring back on now that the routing has completed.
		this.startLocationMonitor();
		
		// Check to see if a route was found. If not, then we need to trigger a 404 event.
		if (!routeFound){
			
			// Trigger a 404 location. 
			// NOTE: This will currently break the ability to use the back button on the 
			// browser (since it will keep trying to relocate to the 404 on back). Will need
			// to rethink the way this is handled later.
			this.relocateTo( "404" );
			
		}
	};
	
	
	// I create a proxy for the callback so that given callback executes in the 
	// context of the application object, overriding any context provided by the
	// calling context.
	Application.prototype.proxyCallback = function( callback ){
		var self = this;
		
		// Return a proxy that will apply the callback in the THIS context.
		return(
			function(){
				return( callback.apply( self, arguments ) );
			}	
		);
	}
	
	
	// I relocate the application to the given location. You can also pass through
	// a hash of any additional parameters that you wanted added to the location
	// event that gets triggers.
	Application.prototype.relocateTo = function( newLocation, parameters ){
		this.setLocation( newLocation, parameters );
	};
	
	
	// I start the application.
	Application.prototype.run = function(){
		// Initialize the model.
		this.initModels();
		
		// Initialize the views.
		this.initViews();
		
		// Initialize the controllers.
		this.initControllers();
	
		// Initialize the location monitor.
		this.initLocationMonitor();
		
		// Turn on location monitor.
		this.startLocationMonitor();
		
		// Flag that the application is running.
		this.isRunning = true;
	};
		
		
	// I set the location of the application. I don't do anything explicitly - 
	// I let the location monitoring handle this change implicitly. You can also
	// pass through additional parameters that will be added to the location event
	// that gets triggered.
	Application.prototype.setLocation = function( location, parameters ){
		// Clearn the location.
		location = this.normalizeHash( location );
	
		// Create variables to hold the new and old hashes.
		var oldLocation = this.currentLocation;
		var newLocation = location;
		
		// Store the new location.
		this.currentLocation = location;
		
		// Make sure the hash is the same as the location (this way, we don't
		// get circular logic as the monitor keeps pinging the hash).
		window.location.hash = ("#/" + location );
	
		// The location has changed - trigger the change event on the application
		// object so that anyone monitoring it can react.
		$( this ).trigger({
			type: "locationchange",
			fromLocation: oldLocation,
			toLocation: newLocation,
			parameters: parameters
		});
	};
	
	
	// I turn on the location monitoring.
	Application.prototype.startLocationMonitor = function(){
		var self = this;
		
		// Create the interval function.
		this.locationMonitorInterval = setInterval(
			function(){				
				self.checkLocationForChange();
			},
			this.locationMonitorDelay
		);
	};
	
	
	// I turn off the location monitoring.
	Application.prototype.stopLocationMonitor = function(){
		clearInterval( this.locationMonitorInterval );
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// I am the prototype for the application controllers. This is so they
	// can leverage some binding magic without the overhead of the implimentation.
	Application.prototype.Controller = function(){
		// ...
	};
	
	
	// I am the prototype for the Controller prototype.
	Application.prototype.Controller.prototype = {
	
		// I route the given pseudo location to the given controller method.
		route: function( path, handler ){
			// Strip of any trailing and leading slashes.
			path = application.normalizeHash( path );
		
			// We will need to extract the parameters into an array - these will be used 
			// to create the event object when the location changes get routed.
			var parameters = [];
			
			// Extract the parameters and replace with capturing groups at the same
			// time (such that when the pattern is tested, we can map the captured
			// groups to the ordered paramters above.
			var pattern = path.replace(
				new RegExp( "(/):([^/]+)", "gi" ),
				function( $0, $1, $2 ){
					// Add the named parameter.
					parameters.push( $2 );
					
					// Replace with a capturing group. This captured group will be used
					// to create a named parameter if this route gets matched.
					return( $1 + "([^/]+)" );
				}
				);
			
			// Now that we have our parameters and our test pattern, we can create our 
			// route mapping (which will be used by the application to match location 
			// changes to controllers).
			application.routeMappings.push({
				controller: this,
				parameters: parameters,
				test: new RegExp( ("^" + pattern + "$"), "i" ),
				handler : handler
			});
		}		
		
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// Create a new instance of the application and store it in the window.
	window.application = new Application();
	
	// When the DOM is ready, run the application.
	$(function(){
		window.application.run();
	});
	
	// Return a new application instance.
	return( window.application );
	
})( jQuery );
