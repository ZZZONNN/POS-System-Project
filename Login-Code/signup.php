<?php
session_start();
require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['uname']);
    $password = password_hash(trim($_POST['psw']), PASSWORD_DEFAULT);
    $account_type = $_POST['account_type'];
    
    // Check if username exists in either table
    $check = $conn->prepare("SELECT username FROM Staff WHERE username = ? UNION SELECT username FROM Admin WHERE username = ?");
    $check->bind_param("ss", $username, $username);
    $check->execute();
    $check->store_result();
    
    if ($check->num_rows > 0) {
        header("Location: Signup.html?error=username_taken");
        exit();
    }
    $check->close();
    
    // Insert into appropriate table
    $table = ($account_type == "staff") ? "Staff" : "Admin";
    $stmt = $conn->prepare("INSERT INTO $table (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);
    
    if ($stmt->execute()) {
        header("Location: Login.html?success=1");
    } else {
        header("Location: Signup.html?error=database");
    }
    
    $stmt->close();
}

$conn->close();
?>