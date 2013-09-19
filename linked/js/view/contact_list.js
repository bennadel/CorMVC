
// I am a view helper for the Contact List. I bind the appropriate 
// event handlers and translate the UI events into actions within 
// the application.

// Add view to the application.
window.application.addView((function( $, application ){

	// I am the contact list view class.
	function ContactList(){
		this.view = null;
		this.searchForm = null;
		this.searchCriteria = null;
		this.addLink = null;
		this.contactList = null;
		this.contactTemplate = null;
	};

	
	// I initialize the view. I get called once the application starts
	// running (or when the view is registered - if the application is 
	// already running). At that point, the DOM is available and all the other 
	// model and view classes will have been added to the system.
	ContactList.prototype.init = function(){
		var self = this;
		
		// Initialize properties.
		this.view = $( "#contact-list-view" );
		this.searchForm = $( "#contact-list-header form" );
		this.searchCriteria = this.searchForm.find( "input" );
		this.addLink = $( "#contact-list-header a" );
		this.contactList = $( "#contact-list" );
		this.contactTemplate = $( "#contact-list-item-template" );
		
		// Bind the search form submit.
		this.searchForm.submit(
			function( event ){
				// Hand of to the search form handler.
				self.searchFormHandler();
				
				// Cancel the default event.
				return( false );
			}
		);
		
		// Bind the keypress event on the search criteria.
		this.searchCriteria.keyup(
			function( event ){
				// Filter the contact list.
				self.filterList( this.value );
			}
		);
		
		// Bind the keypress event to the search criteria so we can track 
		// the use of the special keys presses.
		this.searchCriteria.keypress(
			function( event ){
				// Store the SHIFT and ALT key status of the current click.
				self.searchCriteria.data( "shift", event.shiftKey );
				self.searchCriteria.data( "alt", event.altKey );
			}
		);
		
		// Bind the list-level clicking (to avoid setting to many 
		// event handlers).
		this.contactList.click(
			function( event ){
				var target = $( event.target );
				
				// Check to see if the target is the "more" link.
				if (target.is( "a.more" )){
					
					// Toggle the list item details.
					self.toggleDetails( target.parents( "li" ) );
					
					// Blur the current link.
					target.blur();
					
					// Prevent default event.
					return( false );
					
				// Check to see if the target is a the "delete" link.
				} else if (target.is( "a.delete" )){
				
					// Blur the current link.
					target.blur();
									
					// Confirm that the user wants to delete the contact.
					if (confirm( "Delete this contact?" )){
					
						// This is a *hack* that we have to do since jQuery click() 
						// event won't trigger the default action of the link.
						application.setLocation( target.attr( "href" ) );
					
					}
					
					// Return false to cancel default event.
					return( false );		
					
				}
			}
		);
	};
	
	
	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	
	// I clear the contact list.
	ContactList.prototype.clearList = function(){
		this.contactList.empty();
	};
	
	
	// I clear the search form.
	ContactList.prototype.clearSearchForm = function(){
		this.searchForm[ 0 ].reset();
	};
	
	
	// I filter the contact list based on the given value.
	ContactList.prototype.filterList = function( criteria ){
		// Convert criteria to lower case.
		criteria = criteria.toLowerCase();
	
		// Get all the list items that do NOT match the criteria and hide them.
		this.contactList.find( "> li" )
			// Show all the items.
			.show()
			
			// Filter down to the ones that don't match.
			.filter(
				function( index ){
					// Get the model associated with this template.
					var contact = $( this ).data( "model" );
					
					// Check the domain values.
					var matchesCriteria = (
						(contact.name.toLowerCase().indexOf( criteria ) >= 0) ||
						(contact.phone.toLowerCase().indexOf( criteria ) >= 0) ||
						(contact.email.toLowerCase().indexOf( criteria ) >= 0)
					);
					
					return( !matchesCriteria );				
				}			
			)
			
			// Hide the ones that don't match.
			.hide()
		;
	};
	
	
	// I get called when the view needs to be hidden.
	ContactList.prototype.hideView = function(){
		this.view.removeClass( "current-primary-content-view" );
	};	
	
	
	// I populate the list of contacts.
	ContactList.prototype.populateList = function(){
		var self = this;
		
		// Clear the list.
		this.clearList();
		
		// Get the contacts.
		application.getModel( "ContactService" ).getContacts(
			function( contacts ){
				// Loop over the contacts and create templates.
				$.each(
					contacts,
					function( index, contact ){
						// Append the contact to the list display.
						self.contactList.append( 
							application.getFromTemplate( self.contactTemplate, contact ) 
							);
					}
				);
			}
		);
	};
	
	
	// I handle any submit on the search form.
	ContactList.prototype.searchFormHandler = function(){
		var visibleContacts = this.contactList.find( "> li:visible" )
				
		// Check to see if there are any visible contacts.
		if (visibleContacts.size()){
			
			// Check to see if the SHIFT button was down when form was submitted.
			// If so, then we are going to go to the edit page for the first contact.
			if (this.searchCriteria.data( "shift" )){
		
				// Form was submitted with special action button - forward to
				// edit page for given contact.
				application.relocateTo( "contacts/edit/" + visibleContacts.eq( 0 ).data( "model" ).id );
			
			// Check to see if the ALT button was down when the form was submitted.
			// If so, then we are going to trigger the delete of the first contact.
			} else if (this.searchCriteria.data( "alt" )){
			
				// Trigger delete.
				setTimeout(
					function(){
						visibleContacts.eq( 0 ).find( "a.delete" ).click();
					},
					20
				);
			
			} else {
			
				// There are visible items and no special action buttons, 
				// so just show details. For performance reasons (and usability),
				// only show the first 3 visible items. To do this, we are just
				// going to simulate the click of the "more" link.
				visibleContacts.filter( ":lt(3)" ).find( "a.more" ).click();
			
			}
		
		} else {
		
			// Since there are visible items, send to add form. Pass the search
			// form data through to the next location.
			application.relocateTo( 
				"contacts/add",
				{
					name: this.searchCriteria.val()
				}
			);
		
		}
	};
	
	
	// I get called when the view needs to be shown.
	ContactList.prototype.showView = function(){
		// Clear the search form.
		this.clearSearchForm();
		
		// Show the view.
		this.view.addClass( "current-primary-content-view" );
		
		// Populate the contacts.
		this.populateList();
		
		// Focust the search form.
		this.searchCriteria[ 0 ].focus();
	};	
	
	
	// I toggle the details of a given contact list item.
	ContactList.prototype.toggleDetails = function( contactListItem ){
		// Toggle the details.
		contactListItem
			.find( "> dl.details" )
				.slideToggle( 250 )
		;
	};
	

	// ----------------------------------------------------------------------- //
	// ----------------------------------------------------------------------- //
	
	// Return a new view class singleton instance.
	return( new ContactList() );
	
})( jQuery, window.application ));
