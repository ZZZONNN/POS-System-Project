<?php
header('Content-Type: application/json');

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
    
    // Get products
    $stmt = $conn->query("
        SELECT 
            id, 
            name, 
            stock AS Stocks, 
            category, 
            compatibility, 
            class, 
            colors
        FROM products
        WHERE stock >= 0
        ORDER BY name
    ");
    
    $products = $stmt->fetchAll();
    
    // Add stock status for frontend
    foreach ($products as &$product) {
        $product['stock_status'] = ($product['Stocks'] > 5) ? 'in-stock' : 
                                 (($product['Stocks'] > 0) ? 'low-stock' : 'out-of-stock');
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'count' => count($products)
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'code' => $e->getCode()
    ]);
}
?>