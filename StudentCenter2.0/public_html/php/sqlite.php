<?php
    //First, we get the data.
    $query = $_POST['sql'];
    
    //Ensures we don't have error.
    if ($query == ""){
        die("error");
    }
    
    //Next we run sqlite.
    $dir = '../database/data.db';
    $db = new SQLite3($dir) or die("error");
    $results = $db->query($query);
    
    //Generates array for row.
    $data = array();
    $i = 0;
    while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
        $data[$i] = $row;
        $i = $i + 1;
    }
    
    echo json_encode($data);
?>