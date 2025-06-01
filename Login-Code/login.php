<?php
session_start();
require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = trim($_POST['uname']);
    $password = trim($_POST['psw']);
    
    // Check in Staff table
    $stmt = $conn->prepare("SELECT user_id, username, password FROM Staff WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $account_type = "staff";
    $stmt->close();
    
    // If not found in Staff, check Admin table
    if (!$user) {
        $stmt = $conn->prepare("SELECT user_id, username, password FROM Admin WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $account_type = "admin";
        $stmt->close();
    }

    // Verify user and password
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['account_type'] = $account_type;
        
        header("Location: " . ($account_type == "admin" ? "http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/ManageProducts/manageinventory.html" : "http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/Staff/POS/order.html"));
        exit();
    } else {
        header("Location: Login.html?error=1");
        exit();
    }
}

$conn->close();
?>