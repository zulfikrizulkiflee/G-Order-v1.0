<?php
header("Access-Control-Allow-Origin: *");
include("conn.php");
$action = $_GET['action'];

if ($action == "register") {
    $name     = $_GET['regname'];
    $callsign = $_GET['regcallsign'];
    $email    = $_GET['regemail'];
    $password = $_GET['regpassword1'];
    $phone    = $_GET['regphone'];
    $stockist_id = $_GET['regstockist'];
    $stockist_regid = $_GET['regstockistid'];
    
    // To protect from MySQL injection
    $name     = stripslashes($name);
    $callsign = stripslashes($callsign);
    $email    = stripslashes($email);
    $password = stripslashes($password);
    $phone    = stripslashes($phone);
    $stockist_id = stripslashes($stockist_id);
    $stockist_regid = stripslashes($stockist_regid);
    $name     = mysqli_real_escape_string($db, $name);
    $callsign = mysqli_real_escape_string($db, $callsign);
    $email    = mysqli_real_escape_string($db, $email);
    $password = mysqli_real_escape_string($db, $password);
    $phone    = mysqli_real_escape_string($db, $phone);
    $stockist_id = mysqli_real_escape_string($db, $stockist_id);
    $stockist_regid = mysqli_real_escape_string($db, $stockist_regid);
    $password = md5($password);
    
    $check_email_for_duplicates = mysqli_query($db, "SELECT * FROM `obe_user` WHERE `user_email` = '" . $email . "'");
    if (mysqli_num_rows($check_email_for_duplicates) > 0) {
        echo 'false';
    } else {
        if($stockist_id != ''){
            $validate_stockist_id = mysqli_query($db, "SELECT * FROM `obe_subscription` WHERE `stockist_id` = '" . $stockist_id . "' AND status = 'Active'");
            
            $data = $validate_stockist_id->fetch_array();
            
            if (mysqli_num_rows($validate_stockist_id) <= 0) {
                echo 'Invalid/Inactive Stockist ID';
            }else{
                $sql    = "INSERT INTO obe_user (user_name,user_callsign,user_email,user_password,user_phone,user_role) VALUES ('" . $name . "','" . $callsign . "','" . $email . "','" . $password . "','" . $phone . "','Agent')";
                $result = mysqli_query($db, $sql);
                $id = $db->insert_id;
                
                mysqli_query($db, "INSERT INTO obe_network (obe_id,parent_id) VALUES (" .$id. ", '" .$data['obe_id']. "')");
                
                echo "Successful Register";
            }
        }else{
            if ($stockist_regid != ''){
                $sql    = "INSERT INTO obe_user (user_name,user_callsign,user_email,user_password,user_phone,user_role) VALUES ('" . $name . "','" . $callsign . "','" . $email . "','" . $password . "','" . $phone . "','Stockist')";
                $result = mysqli_query($db, $sql);
                $regid = $db->insert_id;
                
                mysqli_query($db, "INSERT INTO obe_subscription (obe_id,stockist_id) VALUES (" .$regid. ", '" .$stockist_regid. "')");
            }else{
                $sql    = "INSERT INTO obe_user (user_name,user_callsign,user_email,user_password,user_phone) VALUES ('" . $name . "','" . $callsign . "','" . $email . "','" . $password . "','" . $phone . "')";
                $result = mysqli_query($db, $sql);
            }
            
            echo "Successful Register";
        }
    }
}

if ($action == "login") {
    $email    = $_GET['logemail'];
    $password = $_GET['logpassword'];
    
    // To protect from MySQL injection
    $email    = stripslashes($email);
//    $password = stripslashes($password);
    
    $email    = mysqli_real_escape_string($db, $email);
//    $password = mysqli_real_escape_string($db, $password);
    
    $password = md5($password);
    
    $myArray = array();
    if ($result = $db->query("SELECT ou.obe_id,ou.user_name,ou.user_role,os.stockist_id,os.status FROM obe_user ou LEFT JOIN obe_subscription os ON ou.obe_id=os.obe_id WHERE ou.user_email='".$email."' AND ou.user_password='".$password."'")) {
        $tempArray = array();
        while($row = $result->fetch_object()) {
            $tempArray = $row;
            array_push($myArray, $tempArray);
        }
        if (!empty($myArray)) {
            echo json_encode($myArray);
        }
    }
    $result->close();
}

if ($action == "check_id") {
    $id    = $_GET['id'];
    
    // To protect from MySQL injection
    $id    = stripslashes($id);
    
    $result = mysqli_query($db, "SELECT stockist_id FROM obe_subscription WHERE stockist_id='".$id."'");
        
    if (mysqli_num_rows($result) <= 0) {
        echo 1;
    }else{ 
        echo 0;
    }
    $result->close();
}

if ($action == "network") {
    $id    = $_GET['obe_id'];
    $stockist_id = $_GET['regstockist'];
    
    // To protect from MySQL injection
    $id     = stripslashes($id);
    $stockist_id = stripslashes($stockist_id);
    $id     = mysqli_real_escape_string($db, $id);
    $stockist_id = mysqli_real_escape_string($db, $stockist_id);
    
    if(isset($stockist_id)){
        $validate_stockist_id = mysqli_query($db, "SELECT * FROM `obe_subscription` WHERE `stockist_id` = '" . $stockist_id . "' AND status = 'Active'");
            
        $data = $validate_stockist_id->fetch_array();
            
        if (mysqli_num_rows($validate_stockist_id) <= 0) {
            echo 'Invalid/Inactive Stockist ID';
        }else{   
            mysqli_query($db, "INSERT INTO obe_network (obe_id,parent_id) VALUES (" .$id. ", '" .$data['obe_id']. "')");
            
            mysqli_query($db, "UPDATE obe_user SET user_role = 'Agent' WHERE obe_id = " .$id. "");
            
            $validate_stockist_id = mysqli_query($db, "SELECT * FROM `obe_user` WHERE `obe_id` = '" . $data['obe_id'] . "'");
            
            $data_stockist = $validate_stockist_id->fetch_array();
            
            echo 1;
        }
    }  
}

if ($action == "check_address"){
    $id    = $_GET['obe_id'];
    
    $sql = "SELECT * FROM `obe_address` WHERE `obe_id` = '" . $id . "'";
    
    $myArray = array();
    if ($result = $db->query($sql)) {

        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $myArray[] = $row;
        }
        echo json_encode($myArray);
    }
    
//    if (mysqli_num_rows($check_address) > 0) {
//        echo 1;
//    }
}

$db->close();
?>
