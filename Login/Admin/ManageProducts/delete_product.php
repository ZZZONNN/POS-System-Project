<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Database configuration
$config = [
    'host' => 'localhost',
    'dbname' => 'phone_repair_shop',
    'username' => 'root',
    'password' => '',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
];

try {
    // Get product ID
    $productId = $_GET['id'] ?? null;
    if (!$productId) {
        throw new Exception("Product ID is required");
    }
    
    // Create connection
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";
    $conn = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    // Delete product
    $stmt = $conn->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute([':id' => $productId]);
    
    echo json_encode([
        'success' => $stmt->rowCount() > 0,
        'message' => $stmt->rowCount() > 0 ? 'Product deleted' : 'Product not found'
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>