
// I control the primary navigation and the corresponding view of content that 
// is displayed on the page. I do not control the content that is displayed within 
// the primary content view (that is delegated to the other controllers).

// Add a controller to the application.
window.application.addController((function( $, application ){

	// I am the controller class.
	function Controller(){
		// Route URL events to the controller's event handlers.
		this.route( "/", this.index );
		this.route( "/home", this.index );
		this.route( "/contacts.*", this.contacts );
		this.route( "/documentation", this.documentation );
		this.route( "/resources", this.resources );
		this.route( "/404", this.pageNotFound );

		// Set default properties.
		this.navigation = null;
		this.navigationItems = null;
		this.views = null;
		this.homeView = null;
		this.contactsView = null;
		this.documentationView = null;
		this.resourcesView = null;
		this.pageNotFoundView = null;
	};

	// Extend the core application controller (REQUIRED).
	Controller.prototype = new application.Controller();
	
	
	// I initialize the controller. I get called once the application starts
	// running (or when the controller is registered - if the application is 
	// already running). At that point, the DOM is available and all the other 
	// model and view classes will have been added to the system.
	Controller.prototype.init = function(){
		this.navigation = $( "#site-navigation" );
		this.navigationItems = this.navigation.find( "> li:has(a[rel])" );
		this.views = $( "#primary-content-stages > li" );
		this.homeView = this.views.filter( "[ rel = 'home' ]" );
		this.contactsView = this.views.filter( "[ rel = 'contacts' ]" );
		this.documentationView = this.views.filter( "[ rel = 'documentation' ]" );
		this.resourcesView = this.views.filter( "[ rel = 'resources' ]" );
		this.pageNotFoundView = this.views.filter( "[ rel = '404' ]" );
		
		// Update the copyright year.
		$( "#site-copyright span.copyright-year" ).text(
			(new Date()).getFullYear()	
		);
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// I show the contacts view.
	Controller.prototype.contacts = function( event ){
		this.showView( this.contactsView );
	};
	
	
	// I show the documentation view.
	Controller.prototype.documentation = function( event ){
		this.showView( this.documentationView );
	};
	
		
	// I am the default event for this controller.
	Controller.prototype.index = function( event ){
		this.showView( this.homeView );
	};
	
	
	// I show the page not found view.
	Controller.prototype.pageNotFound = function( event ){
		this.showView( this.pageNotFoundView );
	};
	
	
	// I show the resources view.
	Controller.prototype.resources = function( event ){
		this.showView( this.resourcesView );
	};
	
	
	// I show the given view; but first, I hide any existing view.
	Controller.prototype.showView = function( view ){
		// Turn off the primary navigation. 
		this.navigationItems.removeClass( "on" );
		
		// Remove the current view class.
		this.views.removeClass( "current-primary-content-stage" );
		
		// Turn on the correct navigation. Match the REL attribute of the given
		// view to the REL attribute of the anchor inside the navigation item.
		if (view.attr( "rel" )){
			this.navigationItems.filter( ":has(a[rel = '" + view.attr( "rel" ) + "' ])" ).addClass( "on" );
		}
		
		// Add the primary content view class.
		view.addClass( "current-primary-content-stage" );
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new contoller singleton instance.
	return( new Controller() );
	
})( jQuery, window.application ));
