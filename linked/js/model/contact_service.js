
// I am the gateway to the contacts collection within the system. For this
// demo, there is no communication with the server - all contacts are stored
// locally and internally to this service object.

// Add model to the application.
window.application.addModel((function( $, application ){

	// I am the contacts service class.
	function ContactService(){
		this.contacts = [];
		this.contactsIndex = {};
		this.uuid = 0;
	};

	
	// I initialize the model. I get called once the application starts
	// running (or when the model is registered - if the application is 
	// already running). At that point, the DOM is available and all the other 
	// model and view classes will have been added to the system.
	ContactService.prototype.init = function(){
		// ... nothing needed here ...
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// I delete the contact at the given ID.
	ContactService.prototype.deleteContact = function( id, onSuccess, onError ){
		// Loop over the array looking for the given contact.
		for (var i = 0 ; i < this.contacts.length ; i++){
		
			// Check to see if this is the target contact.
			if (this.contacts[ i ].id == id){
				
				// Delete this contact from the collection.
				this.contacts.splice( i, 1 );
			
				// Delete this contact from the index.
				this.contactsIndex[ id ] = null;
			
				// Break out of the loop.
				break;
				
			}
		
		}
		
		// Call the callback with the given id.
		onSuccess( id );
	};
	
	
	// I get the contact at the given ID.
	ContactService.prototype.getContact = function( id, onSuccess, onError ){
		// Check to see if the contact exists.
		if (this.contactsIndex[ id ]){
		
			// Return the given contact.
			onSuccess( this.contactsIndex[ id ] );
		
		} else {
		
			// The contact could not be found - just return a new contact.
			onSuccess(
				application.getModel( "Contact", [ 0 ] )
			);
		
		}
	};
	
	
	// I get the contacts.
	ContactService.prototype.getContacts = function( onSuccess, onError ){
		// Return the contacts collection.
		onSuccess( this.contacts );
	};
	
	
	// I save the given contact.
	ContactService.prototype.saveContact = function( id, name, phone, email, onSuccess, onError ){
		// Create an array to hold the validation errors.
		var errors = [];
		
		// Validate the name.
		if ($.trim( name ).length == 0){
			
			// Add a new error.
			errors.push({
				type: "MissingData",
				message: "[NAME] is required",
				parameter: "name"
			});
			
		}
		
		// Valide the email.
		if (
			email.length &&
			!(new RegExp( "^[^@]+@([^.]+\\.)+[^.]{2,}$", "i" )).test( email )
			){
		
			// Add a new error.
			errors.push({
				type: "InvalidValue",
				message: "[EMAIL] is invalid",
				parameter: "email"
			});
		
		}
	
		// Check to see if there any errors.
		if (errors.length){
			
			// Return errors.
			onError( errors );
		
		} else {
		
			// The contact validated, save it.
	
			// Check to see if this contact exists.
			if (this.contactsIndex[ id ]){
			
				// Simply update the contact information.
				this.contactsIndex[ id ].name = name;
				this.contactsIndex[ id ].phone = phone;
				this.contactsIndex[ id ].email = email;
			
			} else {
			
				// Create a new contact.
				var contact = application.getModel( "Contact", [ ++this.uuid, name, phone, email ] );
			
				// Add the contact to the collection.
				this.contacts.push( contact );
				
				// Add the contact to the index.
				this.contactsIndex[ contact.id ] = contact;
				
			}
			
			// Sort the contacts collection.
			this.contacts.sort(
				function( a, b ){
					if (a.name < b.name){
						return( -1 );
					} else {
						return( 1 );
					}
				}
			);
			
			// Return the saved contact id.
			onSuccess( id );
			
		}
	};
	

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new model class singleton instance.
	return( new ContactService() );
	
})( jQuery, window.application ));



// ----------------------------------------------------------------------- //
// FOR THE DEMO ONLY!!!													   //
// ----------------------------------------------------------------------- //

// When the DOM is ready, pre-populate some sample data.
jQuery(function( $ ){
	
	// Get the contact service.
	var contactService = window.application.getModel( "ContactService" );
	
	var onSuccess = function(){};
	
	// Add some test data to the database.
	contactService.saveContact( 0, "Ben Nadel", "212-555-1234", "ben.nadel@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Rey Bango", "212-555-2345", "rey.bango@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Cody Lindley", "212-555-0393", "cody.lindley@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Scott Gonzalez", "212-555-0908", "scott.gonzalez@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Rebecca Murphey", "212-555-1433", "rebecca.murphey@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Adam Sontag", "212-555-3948", "adam.sontag@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Karl Swedberg", "212-555-9983", "karl.swedberg@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Dan Wellman", "212-555-3434", "dan.wellman@corMVC.com", onSuccess );
	contactService.saveContact( 0, "John Resig", "212-555-7890", "john.resig@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Paul Irish", "212-555-4311", "paul.irish@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Ben Alman", "212-555-7829", "ben.alman@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Bob Bonifield", "212-555-1248", "bob.bonifield@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Vlad Filippov", "212-555-8282", "vlad.filippov@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Jon Snook", "212-555-7894", "jon.snook@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Jon Clark", "212-555-4561", "jon.clark@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Elijah Manor", "212-555-4566", "elijah.manor@corMVC.com", onSuccess );
	contactService.saveContact( 0, "James Padolsey", "212-555-1591", "james.padolsey@corMVC.com", onSuccess );
	contactService.saveContact( 0, "Alex Sexton", "212-555-1236", "alex.sexton@corMVC.com", onSuccess );
	
});
	