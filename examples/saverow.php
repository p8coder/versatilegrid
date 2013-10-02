<?php
	//Post Values
	$page = (int)$_POST['page']; 
	
	$page = $page > 0 ? $page : 1;
	$limit = $limit > 0 ? $limit : 5;
	
	if(empty($_POST['fname']) || empty($_POST['lname']) || empty($_POST['phone']) || empty($_POST['email'])) {
		die("Wrong data provided");
	}
	
	$fname = strlen($_POST['fname']) > 70 ? substr($_POST['fname'], 0, 70) : $_POST['fname'];
	$lname = strlen($_POST['lname']) > 70 ? substr($_POST['lname'], 0, 70) : $_POST['lname'];
	$phone = strlen($_POST['phone']) > 70 ? substr($_POST['phone'], 0, 70) : $_POST['phone'];
	$email = strlen($_POST['email']) > 70 ? substr($_POST['email'], 0, 70) : $_POST['email'];
	
	# connect to the database  
	try {  

	  //Put Your DB Information
	  $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);  	
	  $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  
	  
	}catch(PDOException $e) {  
		//echo "Can't connect to DB: ". $e->getMessage();  
		die("Can't connect to DB");
	}	
	
	$sql = "INSERT INTO contacts (first_name,last_name,email,phone) VALUES (:fname,:lname,:email,:phone)";
	$q = $db->prepare($sql);
	
	$values = array(':fname'=>htmlentities($fname),
					':lname'=>htmlentities($lname),
					':email'=>htmlentities($email),
					':phone'=>htmlentities($phone)
			  );
					  
	if ($q->execute($values)) {
		echo "ok";
	} else {
		//$errorcode = $sql->errorCode();
		echo "error";
	}					  
?>