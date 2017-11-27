<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if($action == "order"){
    $agent_id = $_GET['agent_id'];
    $stockist_id = $_GET['stockist_id'];
    $order_detail = json_encode($_GET['order_detail']);
    $method = $_GET['method'];
    $note = $_GET['note'];
    $total_quantity = $_GET['total_quantity'];
    
    $sql = "INSERT INTO obe_order (order_detail,stockist_id,agent_id,method,note,total_quantity) VALUES ('" .$order_detail. "', " .$stockist_id. ", " .$agent_id. ",'" .$method. "','" .$note. "',".$total_quantity.")";

    mysqli_query($db, $sql);
    
    if(mysqli_affected_rows($db)>0){
        echo mysqli_insert_id($db);;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "add_address"){
    $agent_id = $_GET['agent_id'];
    $receiver_name = $_GET['receiver-name'];
    $phone_num = $_GET['phone-num'];
    $receiver_address = $_GET['receiver-address'];
    $receiver_city = $_GET['receiver-city'];
    $postcode = $_GET['postcode'];
    $state = $_GET['state'];
    
    $check_1st_address = mysqli_query($db, "SELECT * FROM `obe_address` WHERE `obe_id` = " . $agent_id);

    $data = $check_1st_address->fetch_array();

    if (mysqli_num_rows($check_1st_address) == 0) {
        $sql = "INSERT INTO obe_address (obe_id,receiver_name,phone_num,address,city,postcode,state,default_address) VALUES (".$agent_id.",'".$receiver_name."','".$phone_num."','".$receiver_address."','".$receiver_city."','".$postcode."','".$state."',1)";
    }else{
        if(isset($_GET['default'])){
            mysqli_query($db, "UPDATE obe_address SET default_address=0 WHERE obe_id=".$agent_id);
            $sql = "INSERT INTO obe_address (obe_id,receiver_name,phone_num,address,city,postcode,state,default_address) VALUES (".$agent_id.",'".$receiver_name."','".$phone_num."','".$receiver_address."','".$receiver_city."','".$postcode."','".$state."',1)";
        }else{
            $sql = "INSERT INTO obe_address (obe_id,receiver_name,phone_num,address,city,postcode,state) VALUES (".$agent_id.",'".$receiver_name."','".$phone_num."','".$receiver_address."','".$receiver_city."','".$postcode."','".$state."')";
        }
    }
    
    mysqli_query($db, $sql);
    
    if(mysqli_affected_rows($db)>0){
        echo 1;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "edit_address"){
    $address_id = $_GET['address_id'];
    $agent_id = $_GET['agent_id'];
    $receiver_name = $_GET['receiver-name'];
    $phone_num = $_GET['phone-num'];
    $receiver_address = $_GET['receiver-address'];
    $receiver_city = $_GET['receiver-city'];
    $postcode = $_GET['postcode'];
    $state = $_GET['state'];

    if(isset($_GET['default'])){
        mysqli_query($db, "UPDATE obe_address SET default_address=0 WHERE obe_id=".$agent_id);
        $sql = "UPDATE obe_address SET receiver_name='".$receiver_name."',phone_num='".$phone_num."',address='".$receiver_address."',city='".$receiver_city."',postcode='".$postcode."',state='".$state."',default_address=1 WHERE id=".$address_id;
    }else{
        $sql = "UPDATE obe_address SET receiver_name='".$receiver_name."',phone_num='".$phone_num."',address='".$receiver_address."',city='".$receiver_city."',postcode='".$postcode."',state='".$state."',default_address=0 WHERE id=".$address_id;
    }
    
    mysqli_query($db, $sql);

    if(mysqli_affected_rows($db)>0){
        echo 1;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "delete_address"){
    $address_id = $_GET['address_id'];
    $agent_id = $_GET['agent_id'];

    mysqli_query($db, "DELETE FROM obe_address WHERE id=".$address_id." AND obe_id=".$agent_id);

    if(mysqli_affected_rows($db)>0){
        echo 1;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "update_address"){
    $address_id = $_GET['address_id'];
    $order_id = $_GET['order_id'];

    mysqli_query($db, "UPDATE obe_order SET address_id=".$address_id.", status='New' WHERE order_id=".$order_id);

    if(mysqli_affected_rows($db)>0){
        echo 1;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "update_cod"){
    $cod_name = $_GET['receiver-name'];
    $phone_num = $_GET['phone-num'];
    $cod_location = $_GET['cod-location'];
    $cod_date = $_GET['cod-day'].'-'.$_GET['cod-month'].'-'.$_GET['cod-year'];
    $cod_time = $_GET['cod-hour'].':'.$_GET['cod-minute'];
    $note = $_GET['note'];
    $order_id = $_GET['order_id'];

    mysqli_query($db, "UPDATE obe_order SET cod_name='".$cod_name."', cod_phone_num='".$phone_num."', cod_location='".$cod_location."', cod_date='".$cod_date."', cod_time='".$cod_time."', note='".$note."', status='New' WHERE order_id=".$order_id);

    if(mysqli_affected_rows($db)>0){
        echo 1;
    }else{
        echo mysqli_error($db);
    }
}

if($action == "agent_order_history"){
    $obe_id = $_GET['obe_id'];

    $sql = "SELECT *,DATE_FORMAT(oo.create_date, '%m') AS month_numeric,DATE_FORMAT(oo.create_date, '%M') AS month,DATE_FORMAT(oo.create_date, '%Y') AS year,DATE_FORMAT(oo.create_date, '%b %d, %Y') AS create_date,oo.status AS order_status FROM obe_order oo LEFT JOIN obe_address oa ON oo.address_id=oa.id LEFT JOIN obe_user ou ON oo.stockist_id=ou.obe_id WHERE agent_id=".$obe_id." ORDER BY oo.create_date DESC";

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

if($action == "stockist_order_history"){
    $obe_id = $_GET['obe_id'];

    $sql = "SELECT *,DATE_FORMAT(oo.create_date, '%m') AS month_numeric,DATE_FORMAT(oo.create_date, '%M') AS month,DATE_FORMAT(oo.create_date, '%Y') AS year,DATE_FORMAT(oo.create_date, '%b %d, %Y') AS create_date,oo.status AS order_status FROM obe_order oo LEFT JOIN obe_address oa ON oo.address_id=oa.id LEFT JOIN obe_user ou ON oo.agent_id=ou.obe_id WHERE stockist_id=".$obe_id." ORDER BY oo.create_date DESC";

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

if($action == "order_invoice"){
    $order_id = $_GET['order_id'];

    $sql = "SELECT *,DATE_FORMAT(oo.create_date, '%M %d, %Y') AS create_date FROM obe_order oo LEFT JOIN obe_address oa ON oo.address_id=oa.id LEFT JOIN obe_user ou ON oo.agent_id=ou.obe_id WHERE order_id=".$order_id;

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