<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if($action == "agent_list"){
    $id     = $_GET['id'];
    
    $sql = "SELECT ou.user_name,obn.status,DATE_FORMAT(obn.set_date,'%d/%m/%Y') AS set_date,obn.obe_id FROM obe_user ou LEFT JOIN obe_network obn ON ou.obe_id=obn.obe_id WHERE obn.parent_id = '".$id."' ORDER BY obn.set_date DESC";
    
    $myArray = array();
    if ($result = $db->query($sql)) {

        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $myArray[] = $row;
        }
        echo json_encode($myArray);
    }
}

if($action == "stockist_list"){
    $id = $_GET['id'];
    $sql = "SELECT obn.parent_id FROM obe_network obn LEFT JOIN obe_user ou ON ou.obe_id=obn.obe_id WHERE ou.obe_id = ".$id." ORDER BY obn.set_date DESC";
    
    $myArray = array();
    if ($result = $db->query($sql)) {
        while($row = $result->fetch_array()) {
            $sql = "SELECT obe_id,user_name,(SELECT COUNT(*) FROM obe_product WHERE obe_id=".$row['parent_id'].") AS total_item,(SELECT brand_name FROM obe_brand_description WHERE obe_id=".$row['parent_id'].") AS brand_name FROM obe_user WHERE obe_id = ".$row['parent_id'];
            $myArray[] = $db->query($sql)->fetch_array(MYSQLI_ASSOC);
        }
        echo json_encode($myArray);
    }
}

if($action == "agent_search"){
    $id     = $_GET['id'];
    $value     = $_GET['value'];
    
    $value     = stripslashes($value);
    
    $value     = mysqli_real_escape_string($db, $value);
    
    $sql = "SELECT ou.user_name,obn.status,DATE_FORMAT(obn.set_date,'%d/%m/%Y') AS set_date,obn.obe_id FROM obe_user ou LEFT JOIN obe_network obn ON ou.obe_id=obn.obe_id WHERE obn.parent_id = '".$id."' AND ou.user_name LIKE '%" .$value. "%' ORDER BY obn.set_date DESC";
    
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

$db->close();
?>
