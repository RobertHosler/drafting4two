<html>

<head>
   <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

</head>

<body>

<?php
/*
$query = "SELECT * WHERE name=\"Birthing Pod\"";

$jsonurl = "http://mtgjson.com/json/AllCards.json";
$json = file_get_contents($jsonurl);//contains the full json file
$database = json_decode($json, true);

 $json_request = array(
"name" => "Birthing Pod"
);
$encoded_request = json_encode($json_request);
echo $encoded_request;

$ch = curl_init( $jsonurl );

$options = array(
CURLOPT_RETURNTRANSFER => true,
CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
CURLOPT_POSTFIELDS => $encoded_request
);

// Setting curl options
curl_setopt_array( $ch, $options );

// Getting results
$result = curl_exec($ch); // Getting jSON result string

echo $result; */

?>

<script type="text/javascript">
var arr = $.getJSON('http://mtgjson.com/json/AllCards.json', function(data) {
	var items = [];
	$.each(data, function(index, value) {
		if (index ==="Birthing Pod") {
			items.push(value);
		}
	});
	for (var i = 0; i != items.length; i++) {
		console.log(items[i].name);
	}
}

</script>

</body>

</html>