<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if($action == "product_list"){
    $stockist_id = $_GET['stockist-id'];
    $sql = "SELECT * FROM obe_product_description opd LEFT JOIN obe_product op ON op.product_id=opd.product_id WHERE op.obe_id=".$stockist_id;
    
    $myArray = array();
    if ($result = $db->query($sql)) {

        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $myArray[] = $row;
        }
        echo json_encode($myArray);
    }
}

$db->close();
?>
