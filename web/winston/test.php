<?php

	$webPath = $_SERVER['DOCUMENT_ROOT']; //path to /web
	$appPath = dirname($webPath);
	$path = $appPath."/data/drafts/";
	$filePath = $path.file;
?>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    </head>
    
    <body>
        <h1>Test</h1>
        <div>
            <?php 
                echo time();
            ?>
        </div>
        <div>
            <?php 
                
                //open in read
			    $f = fopen($filePath, 'r');
			    //exclusive lock
    	        flock($f, LOCK_EX);
    	        //read
			    $content = file_get_contents($filePath);
                echo "State before ";
                echo $content;
                //close
    	        fclose($f);
                
            ?>
            </div>
        <div>
            <?php 
                //updates
			    $content = "Hey ".$_REQUEST['name'];
    	        
    	        //open in write
			    $f = fopen($filePath, 'w');
    	        //write
    	        fwrite($f, $content);
    	        flock($f, LOCK_UN);//unlock
    	        //close
    	        fclose($f);
    	        
			 //   $f = fopen($filePath, 'r');
    	       // flock($f, LOCK_UN);
    	       // fclose($f);
                echo "Written content ";
                echo $content;
                
                ?>
        </div>
        <div>
            <?php 
                
                //open in read write
			    $f = fopen($filePath, 'r');
    	        flock($f, LOCK_SH);//exclusive lock
    	        //read
			    $content = file_get_contents($filePath);
                echo "State after ";
                echo $content;
    	        flock($f, LOCK_UN);//unlock
    	        fclose($f);
            ?>
            </div>
        <div>
        <div>
            <?php 
                echo time();
            ?>
        </div>
    </body>
    
</html>