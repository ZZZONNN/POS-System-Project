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
    // Create connection
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";
    $conn = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    // Get sales data with product details
    $stmt = $conn->query("
        SELECT 
            oi.order_id,
            o.order_date AS date,
            p.id AS product_id,
            p.name,
            oi.quantity,
            oi.price,
            (oi.quantity * oi.price) AS total,
            p.category,
            p.compatibility,
            p.addon,
            oi.colors,
            o.discount AS discount_eligible
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.order_date DESC
    ");
    
    $sales = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $sales,
        'count' => count($sales)
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'code' => $e->getCode()
    ]);
}
?>