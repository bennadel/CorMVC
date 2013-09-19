
// I am the view helper for the Contact Add / Edit form. I bind the 
// appropriate event handlers and translate the UI events into actions
// within the application.

// Add view to the application.
window.application.addView((function( $, application ){

	// I am the contact form view class.
	function ContactForm(){
		this.view = null;
		this.backLink = null;
		this.form = null;
		this.errors = null;
		this.fields = {
			id: null,
			name: null,
			phone: null,
			email: null
		};
		this.cancelLink = null;
	};
	

	// I initialize the view. I get called once the application starts
	// running (or when the view is registered - if the application is 
	// already running). At that point, the DOM is available and all the other 
	// model and view classes will have been added to the system.
	ContactForm.prototype.init = function(){
		var self = this;
		
		// Initialize properties.
		this.view = $( "#contact-edit-view" );
		this.form = $( "#contact-form" );
		this.errors = this.form.find( "div.form-errors" );
		this.fields.id = this.form.find( ":input[ name = 'id' ]" );
		this.fields.name = this.form.find( ":input[ name = 'name' ]" );
		this.fields.phone = this.form.find( ":input[ name = 'phone' ]" );
		this.fields.email = this.form.find( ":input[ name = 'email' ]" );
		this.cancelLink = this.form.find( "div.actions a.cancel" );

		// Bind the submit handler.
		this.form.submit(
			function( event ){
				// Submit the form.
				self.submitForm();
				
				// Cancel default event.
				return( false );
			}
		);
		
		// Bind the cancel link.
		this.cancelLink.click(
			function( event ){
				// Confirm the cancel link.
				return( confirm( "Are you sure you want to cancel?" ) );
			}
		);
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// I apply the given submission errors to the form. This involves translating the 
	// paramters-based errors into user-friendly errors messages.
	ContactForm.prototype.applyErrors = function( errors ){
		var self = this;
		
		// Clear any existing errors.
		this.clearErrors();
		
		// Get the list of error messages.
		var errorList = this.errors.find( "> ul" );
				
		// Loop over the errors to translate them.
		$.each(
			errors,
			function( index, error ){
				var message = "";
				
				// Check to see which type of error this is.
				switch (error.parameter){
					case "name":
						message = "Please enter a name.";
					break;
					case "phone":
						message = "Please enter a valid phone number.";
					break;
					case "email":
						message = "Please enter a valid email.";
					break;
					default:
						message = ("An unknown error occurred: " + error.message + ".");
					break;
				};
			
				// Add the error to the form.
				errorList.append( "<li>" + message + "</li>" );
			}
		);
		
		// Show the errors.
		this.errors.show();
	};
	
	
	// I clear the errors from the field.
	ContactForm.prototype.clearErrors = function(){
		this.errors
			.hide()
			.find( "> ul" )
				.empty()
		;
	};
	
	
	// I diable the form.
	ContactForm.prototype.disableForm = function(){
		// Disable the fields.
		this.fields.name.attr( "disabled", true );
		this.fields.phone.attr( "disabled", true );
		this.fields.email.attr( "disabled", true );
	};
	
	
	// I enable the form.
	ContactForm.prototype.enableForm = function(){
		// Enable the fields.
		this.fields.name.removeAttr( "disabled" );
		this.fields.phone.removeAttr( "disabled" );
		this.fields.email.removeAttr( "disabled" );
	};
	
	
	// I get called when the view needs to be hidden.
	ContactForm.prototype.hideView = function(){
		this.view.removeClass( "current-primary-content-view" );
	};
	
	
	// I populate the form with the given contact informations.
	ContactForm.prototype.populateForm = function( id, name, phone, email ){
		this.fields.id.val( id );
		this.fields.name.val( name );
		this.fields.phone.val( phone );
		this.fields.email.val( email );
	};
	
	
	// I reset the contact form.
	ContactForm.prototype.resetForm = function(){
		// Clear the errors.
		this.clearErrors();
		
		// Reset the form fields.
		this.form.get( 0 ).reset();
	};
	
	
	// I get called when the view needs to be shown.
	ContactForm.prototype.showView = function( parameters ){
		var self = this;
		
		// Reset the form.
		this.resetForm();
		
		// Show the view.
		this.view.addClass( "current-primary-content-view" );
				
		// Check to see if a contact ID was passed in. If so, we need to 
		// populate the form with the given contact data.
		if (parameters.id){
		
			// Diable the form while the model loads. 
			this.disableForm();
			
			// Get the contact and then use it to populate the form.
			application.getModel( "ContactService" ).getContact( 
				parameters.id,
				
				// Success callback.
				function( contact ){
					// Now that we have the form data, enable it.
					self.enableForm();
				
					// Populate the form fields.
					self.populateForm(
						contact.id,
						contact.name,
						contact.phone,
						contact.email
					);
					
					// Focus the first field.
					self.fields.name[ 0 ].focus();
				}			
			);
		
		// If there was no ID, then this is an ADD form. Check to see if a default
		// value was passed for the name.
		} else if ("name" in parameters){
		
			// Populate the name field with the given data.
			this.fields.name.val( parameters.name );
		
		}
		
		// Focus the first field.
		this.fields.name[ 0 ].focus();
	};	
	
	
	// I submit the form.
	ContactForm.prototype.submitForm = function(){
		var self = this;
		
		// Try to save the contact using the contact service.
		application.getModel( "ContactService" ).saveContact(
			this.fields.id.val(),
			this.fields.name.val(),
			this.fields.phone.val(),
			this.fields.email.val(),
			
			// Success callback.
			function( id ){
				application.relocateTo( "contacts" );
			},
			
			// Error callback.
			function( errors ){
				// Apply the errors to the form.
				self.applyErrors( errors );
				
				// Focus the name field.
				self.fields.name[ 0 ].focus();
			}
		);
	};
	

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new view class singleton instance.
	return( new ContactForm() );
	
})( jQuery, window.application ));
