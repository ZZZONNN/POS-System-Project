<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Add this for CORS

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phone_repair_shop";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Fetch products
$sql = "SELECT id, name, price, category, compatibility, colors, addon FROM products";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Ensure all required fields are present
        $row['id'] = (int)$row['id'];
        $row['price'] = (float)$row['price'];
        $products[] = $row;
    }
} else {
    // Return test data if table is empty (for debugging)
    $products = [
        [
            'id' => 1,
            'name' => 'Test Product',
            'price' => 100.00,
            'category' => 'Test',
            'compatibility' => 'Test Device',
            'colors' => 'Red,Blue'
        ]
    ];
}

$conn->close();
echo json_encode($products);
?>