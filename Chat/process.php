<?php
    //this file is called by the chat.js file
    $function = $_POST['function'];
    
    $log = array();
    
    switch($function) {
    
    	 case('getState'):
			//get state checks to see if the file exists and then
			//returns the number of lines in the file
        	 if(file_exists('chat.txt')){
               $lines = file('chat.txt');//file reads a file into an array
        	 }
             $log['state'] = count($lines);//count returns the number of lines
        	 break;	
    	
    	 case('update'):
			
        	 $state = $_POST['state'];
        	 if(file_exists('chat.txt')) {
        	   $lines = file('chat.txt');
        	 }
        	 $count =  count($lines);
        	 if($state == $count){
        		 $log['state'] = $state;//state is the same as passed in
        		 $log['text'] = false;//no new text
        		 
        		 }
        		 else{
        			 $text= array();
        			 $log['state'] = count($lines);
        			 foreach ($lines as $line_num => $line) {
					    if($line_num >= $state){
							$text[] =  $line = str_replace("\n", "", $line);
					    }
         
					 }
        			 $log['text'] = $text;//the new text added to the chat only
        		 }
        	  
             break;
    	 
    	 case('send'):
			$nickname = htmlentities(strip_tags($_POST['nickname']));
			$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
			$message = htmlentities(strip_tags($_POST['message']));
			if(($message) != "\n"){
				if(preg_match($reg_exUrl, $message, $url)) {
					$message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
				}
				fwrite(fopen('chat.txt', 'a'), "<span>". $nickname . "</span>" . $message = str_replace("\n", " ", $message) . "\n"); 
			}
        	break;
    	
    }
    
    echo json_encode($log);

?>