
// ask user for name with popup prompt    
var name = prompt("Enter your chat name:", "Guest");

// default name is 'Guest'
if (!name || name === ' ') {
   name = "Guest";	
}

// strip tags
name = name.replace(/(<([^>]+)>)/ig,"");

// display name on page
$("#name-area").html("You are: <span>" + name + "</span>");

// kick off chat
var chat =  new Chat();
$(function() {

	 //creates the chat state for the current page
	 chat.getState(); 
	 
	 // watch textarea for key presses by adding a function
	 // which watches keypresses to the text area
	 $("#sendie").keydown(function(event) {  
	 
		 var key = event.which;  
   
		 //all keys including return.  
		 if (key >= 33) {
		   
			 var maxLength = $(this).attr("maxlength");  
			 var length = this.value.length;  
			 
			 // don't allow new content if length is maxed out
			 if (length >= maxLength) {  
				 event.preventDefault();  
			 }  
		  }  
	 });
	 
	 // watch textarea for release of key press and
	 // send the message if the key was the enter key
	 $('#sendie').keyup(function(e) {	
		  //watch for enter key
		  if (e.keyCode == 13) { 
			//once enter key is pressed, save the value in the
			//textarea
			var message = $(this).val();
			var maxLength = $(this).attr("maxlength");  
			var length = message.length; 
			 
			// send only if the length of the message is 
			if (length <= maxLength + 1) { 
				//trigger the send method in chat.js
				chat.send(message, name);
				//clear the message area
				$(this).val("");
				
			} else {
				//doesn't send anything if you just hit enter
				//to prevent accidental submissions
				$(this).val(message.substring(0, maxLength));
				
			}	
			
		  }
	 });
	
});