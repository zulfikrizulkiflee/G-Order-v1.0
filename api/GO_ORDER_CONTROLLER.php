<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if($action == "order"){
    $agent_id = $_GET['agent_id'];
    $order_detail = json_encode($_GET['order_detail']);
    $method = $_GET['method'];
    
    $sql = "INSERT INTO obe_order (order_detail,agent_id,method) VALUES ('" .$order_detail. "', " .$agent_id. ",'" .$method. "')";

    mysqli_query($db, $sql);
    
    if(mysqli_affected_rows($db)>0){
        echo 1;
    }
}

if($action == "add_address"){
    $agent_id = $_GET['agent_id'];
    $order_detail = json_encode($_GET['order_detail']);
    $method = $_GET['method'];
    
    $sql = "INSERT INTO obe_order (order_detail,agent_id,method) VALUES ('" .$order_detail. "', " .$agent_id. ",'" .$method. "')";

    mysqli_query($db, $sql);
    
    if(mysqli_affected_rows($db)>0){
        echo 1;
    }

}

$db->close();
?>
