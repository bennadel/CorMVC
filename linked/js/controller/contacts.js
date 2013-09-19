
// I control the events within the Contacts section of the application.

// Add a controller to the application.
window.application.addController((function( $, application ){

	// I am the controller class.
	function Controller(){
		// Route URL events to the controller's event handlers.
		this.route( "/contacts/", this.index );
		this.route( "/contacts/add/", this.addContact );
		this.route( "/contacts/edit/:id", this.editContact );
		this.route( "/contacts/delete/:id", this.deleteContact );
		
		// Set default properties.
		this.currentView = null;
		this.contactListView = null;
		this.contactFormView = null;
	};

	// Extend the core application controller (REQUIRED).
	Controller.prototype = new application.Controller();
	
	
	// I initialize the controller. I get called once the application starts
	// running (or when the controller is registered - if the application is 
	// already running). At that point, the DOM is available and all the other 
	// model and view classes will have been added to the system.
	Controller.prototype.init = function(){
		this.contactListView = application.getView( "ContactList" );
		this.contactFormView = application.getView( "ContactForm" );
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
		
	// I am the add event for this controller.
	Controller.prototype.addContact = function( event ){
		// Show the form view.
		this.showView( this.contactFormView, event );
	};
	
	
	// I am the edit event for this controller.
	Controller.prototype.editContact = function( event, id ){
		// Show the form view.
		this.showView( this.contactFormView, event );
	};
	
	
	// I am the delete event for this controller.
	Controller.prototype.deleteContact = function( event, id ){
		// Delete the contact.
		application.getModel( "ContactService" ).deleteContact(
			id,
			function(){
				application.relocateTo( "contacts" );
			}
		);
	};
	
	
	// I am the default event for this controller.
	Controller.prototype.index = function( event ){
		// Show the list view.
		this.showView( this.contactListView, event );
	};
	
	
	// I show the given view; but first, I hide any existing view.
	Controller.prototype.showView = function( view, event ){
		// Check to see if there is a current view. If so, then hide it.
		if (this.currentView && this.currentView.hideView){
			this.currentView.hideView();
		}
		
		// Show the given view.
		view.showView( event.parameters );
		
		// Store the given view as the current view.
		this.currentView = view;
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new contoller singleton instance.
	return( new Controller() );
	
})( jQuery, window.application ));
