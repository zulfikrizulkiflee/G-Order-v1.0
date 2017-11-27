<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if($action == "agent_list"){
    $id = $_GET['id'];

    $sql = "SELECT ou.user_name AS agent_name,obn.status,DATE_FORMAT(obn.set_date, '%b %d, %Y') AS set_date,obn.obe_id FROM obe_user ou LEFT JOIN obe_network obn ON ou.obe_id=obn.obe_id WHERE obn.parent_id = '".$id."' ORDER BY obn.set_date DESC";

    $myArray = array();
    if ($result = $db->query($sql)) {

        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $myArray[] = $row;
        }
        echo json_encode($myArray);
    }
}

if($action == "agent_search"){
    $id     = $_GET['id'];
    $value     = $_GET['value'];
    
    $value     = stripslashes($value);
    
    $value     = mysqli_real_escape_string($db, $value);
    
    $sql = "SELECT ou.user_name AS agent_name,obn.status,DATE_FORMAT(obn.set_date, '%b %d, %Y') AS set_date,obn.obe_id FROM obe_user ou LEFT JOIN obe_network obn ON ou.obe_id=obn.obe_id WHERE obn.parent_id = '".$id."' AND ou.user_name LIKE '%" .$value. "%' ORDER BY obn.set_date DESC";
    
    $myArray = array();
    if ($result = $db->query($sql)) {
        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $myArray[] = $row;
        }
        echo json_encode($myArray);
    }
}

if($action == "agent_activate"){
    $id     = $_GET['id'];
    $parent_id     = $_GET['parent_id'];
    
    $sql = mysqli_query($db, "UPDATE obe_network SET status = 'Active' WHERE obe_id = " .$id. " AND parent_id = ".$parent_id);
    
    if(mysqli_affected_rows($db) > 0){
        echo 1;
    }else{
        echo 0;
    }
}

if($action == "agent_deactivate"){
    $id     = $_GET['id'];
    $parent_id     = $_GET['parent_id'];
    
    $sql = mysqli_query($db, "UPDATE obe_network SET status = 'Inactive' WHERE obe_id = " .$id. " AND parent_id = ".$parent_id);
    
    if(mysqli_affected_rows($db) > 0){
        echo 1;
    }else{
        echo 0;
    }
}

if($action == "agent_performance"){
    $id = $_GET['obe_id'];

    $sql = "SELECT onet.obe_id,(SELECT user_name FROM obe_user WHERE obe_id=onet.obe_id) AS agent_name,(SELECT total_quantity FROM obe_order WHERE agent_id=onet.obe_id ORDER BY create_date LIMIT 1) AS last_quantity,(SELECT DATE_FORMAT(create_date, '%b %d, %Y') FROM obe_order WHERE agent_id=onet.obe_id ORDER BY create_date LIMIT 1) AS last_order_date, (SELECT SUM(total_quantity) FROM obe_order WHERE agent_id=onet.obe_id AND stockist_id=".$id.") AS total_quantity, (SELECT SUM(total_quantity) FROM obe_order WHERE stockist_id=".$id.") AS total_agent_quantity FROM obe_network onet WHERE onet.parent_id=".$id." ORDER BY total_quantity DESC";

    $myArray = array();
    if ($result = $db->query($sql)) {

        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $myArray[] = $row;
        }
        echo json_encode($myArray);
    }else{
        echo mysqli_error($db);
    }
}

$db->close();
?>
