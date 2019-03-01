<?php
$tz = 'Europe/Berlin';
$timestamp = time();
$dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
$dt->setTimestamp($timestamp); //adjust the object to correct timestamp

$fileName = "Map_1-".$dt->format('d.m.Y-H_i_s');
$username = "testUser";
$map = explode(",",$_POST['map']);
$mapSize = (sizeof($map));
$mapColumns = $_POST['mapColumns'];

$mapArr = [];
$mapArrColumns = [];

//Create php-array with map(list) and columns
for($j = 0; $j < $mapSize/$mapColumns; $j++){
  for($i = 0; $i < $mapColumns; $i++){
    array_push($mapArrColumns, $map[$i]);
    unset($map[$i]);
  }
  array_push($mapArr, $mapArrColumns);
  $mapArrColumns = [];
  $map = array_values($map);
}

// foreach($mapArr as $key => $value){
//     foreach( $value as $key2 => $value2){
//       print "[$key] [$key2] => $value2\n\n";
//     }
//   }

$mapArr1 = json_encode($mapArr, JSON_PRETTY_PRINT );

foreach ($mapArr as $Arr){
  $mapArr1 .= json_encode($Arr).",\r\n";
}


// echo str_replace("],", "],\r\n", substr(substr(json_encode($mapArr), 1), 0, -1));

$mapArr = str_replace('"', '', str_replace("],", "],\r\n    ", substr(substr(json_encode($mapArr), 1), 0, -1)));

$content =
'{
  "name":"'.$_POST['name'].'",
  "description":"'.$_POST['description'].'",
  "structur":[
    '.$mapArr.
  "\r\n  ]
}";


if (!file_exists('maps/'.$username)) {
    mkdir('maps/'.$username, 0777, true);
}

$myfile = fopen('maps/'.$username.'/'.$fileName.'.json', 'w') or die('Unable to open file!');
fwrite($myfile, $content);
fclose($myfile);
?>
