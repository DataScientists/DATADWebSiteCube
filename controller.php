<?php
  if(!empty($_POST['data'])){
	try {
		$theTime = mktime(); 
		$data = $_POST['data'] . "," . $theTime . PHP_EOL;
		
		$file = fopen('/contacts.txt','a+');//creates new file
		fwrite($file, $data);
		fclose($file);
	} catch(Exception $ex) {
		die($ex->getMessage);
	}
  }
?>

