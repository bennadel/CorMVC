
// I represent a contact object.

// Add model to the application.
window.application.addModel((function( $, application ){

	// I am the contact class.
	function Contact( id, name, phone, email ){
		this.id = (id || 0);
		this.name = (name || "");
		this.phone = (phone || "");
		this.email = (email || "");
	};

	// I validate the contact instance.
	Contact.prototype.validate = function(){
		// Not using this right now.
		return( [] );
	};
	

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new model class.
	return( Contact );
	
})( jQuery, window.application ));
