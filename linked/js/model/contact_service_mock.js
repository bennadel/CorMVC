
// I am the gateway to the contacts collection within the system. For this
// demo, there is communication with the "server", but only to invoke hard-coded
// JSON files in attempt to show you how client-server communication might happen.

// Add model to the application.
window.application.addModel((function( $, application ){

	// I am the contacts service class.
	function ContactService(){
		// ... Nothing to do here ...
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
		var self = this;
		
		// Delete the contact on the server and return any error messages.
		application.ajax({
			url: "api/deleteContact.json.txt",
			data: {
				method: "deleteContact",
				id: id
			},
			normalizeJSON: true,
			success: function( response ){
				// Check to see if the request was successful.
				if (response.success){
					// The delete was successful - pass back the ID to the callback.
					onSuccess( id );
				} else if (onError){
					// The call was not successful - call the error function.
					onError( respsonse.errors );
				}
			}
		});
	};
	
	
	// I get the contact at the given ID.
	ContactService.prototype.getContact = function( id, onSuccess, onError ){
		var self = this;
		
		// Get the contacts from the server.
		application.ajax({
			url: "api/getContact.json.txt",
			data: {
				method: "getContact",
				id: id
			},
			normalizeJSON: true,
			success: function( response ){
				// Check to see if the request was successful.
				if (response.success){
					// Create contacts based on the response data and pass the contact 
					// off to the callback.
					onSuccess( self.populateContactsFromResponse( response.data ) );
				} else if (onError){
					// The call was not successful - call the error function.
					onError( respsonse.errors );
				}
			}
		});		
	};
	
	
	// I get the contacts.
	ContactService.prototype.getContacts = function( onSuccess, onError ){
		var self = this;
		
		// Get the contacts from the server.
		application.ajax({
			url: "api/getContacts.json.txt",
			data: {
				method: "getContacts"
			},
			normalizeJSON: true,
			success: function( response ){
				// Check to see if the request was successful.
				if (response.success){
					// Create contacts based on the response data and pass the contacts 
					// collection off to the callback.
					onSuccess( self.populateContactsFromResponse( response.data ) );
				} else if (onError){
					// The call was not successful - call the error function.
					onError( respsonse.errors );
				}
			}
		});
	};
	
	
	// I populate real contact objects based on the raw respons data.
	ContactService.prototype.populateContactsFromResponse = function( responseData ){
		// Check to see if the given response object is an array. If so, 
		// then we will populate an array and return it. If not, then we will
		// populate a single object and return it.
		if ($.isArray( responseData )){
			
			// We are populating an array of contacts.
			var contacts = [];
				
			// Loop over each response item and conver it to a real contact.
			$.each(
				responseData,
				function( index, contactData ){
					contacts.push(
						application.getModel( "Contact", [ contactData.id, contactData.name, contactData.phone, contactData.email ] )
						);
				}
			);
		
			// Return the populated contacts collection.
			return( contacts );
			
		} else {
		
			// We are populating a single contact.
			return( 
				application.getModel( "Contact", [ responseData.id, responseData.name, responseData.phone, responseData.email ] )
			);
			
		}
	};
	
	
	// I save the given contact.
	ContactService.prototype.saveContact = function( id, name, phone, email, onSuccess, onError ){
		var self = this;
		
		// Save the contact on the server and return any error messages.
		application.ajax({
			url: "api/saveContact.json.txt",
			data: {
				method: "saveContact",
				id: id,
				name: name,
				phone: phone,
				email: email
			},
			normalizeJSON: true,
			success: function( response ){			
				// Check to see if the request was successful.
				if (response.success){
					// The save was successful - return the saved contact ID.
					onSuccess( response.data );
				} else {
					// The save was not successful - return the errors.
					onError( response.errors );
				}
			}
		});
	};
	

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new model class singleton instance.
	return( new ContactService() );
	
})( jQuery, window.application ));
