<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

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

$db->close();
?>