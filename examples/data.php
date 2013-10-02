<?php
	//Post Values
	$page = (int)$_POST['page']; //Requested Page
	$limit = (int)$_POST['rows']; //get how many rows we want to have in the grid 
	
	$page = $page > 0 ? $page : 1;
	$limit = $limit > 0 ? $limit : 5;
	
	
	
	# connect to the database  
	try {  
		
	  //Put Your DB Information
	  $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);  
	  $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );  
	  
	}catch(PDOException $e) {  
		//echo "Can't connect to DB: ". $e->getMessage();  
		die("Can't connect to DB");
	}	
	
	//Get all records in table
	$sth = $db->query('SELECT * FROM contacts');  
	$records = count($sth->fetchAll(PDO::FETCH_ASSOC));
	
	$totalPages = $records > 0 ? ceil($records/$limit) : 0;
	
	//Page argument cannot be greater than $totalPages
	$page = $page > $totalPages ? $totalPages : $page;
	
	//die($limit . " * " . $page);
	
	$offset = ($limit * $page) - $limit ;

    $sql ='SELECT * FROM contacts LIMIT :offset, :limit ';
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
	$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //print_r($result);

	$response = new stdClass();
	$response->page = $page; 
	$response->total = $totalPages; 
	$response->records = $records;
	
    foreach ($result as $i => $row){
	
		$response->rows[$i]['id'] = $row[id]; 
		$response->rows[$i]['data'] = array(
			$row["id"],
			$row["first_name"],
			$row["last_name"],
			$row["email"],
			$row["phone"]
		);
    }
	echo json_encode($response);
?>