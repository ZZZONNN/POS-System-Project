<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

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
    // Get input data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Validate input
    if (!isset($data['id'], $data['name'], $data['price'], $data['Stocks'], $data['category'])) {
        throw new Exception("Missing required fields");
    }
    
    // Create connection
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";
    $conn = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    // Update product
    $stmt = $conn->prepare("
        UPDATE products 
        SET name = :name, 
            compatibility = :compatibility, 
            price = :price, 
            stock = :stock, 
            category = :category 
        WHERE id = :id
    ");
    
    $stmt->execute([
        ':id' => $data['id'],
        ':name' => $data['name'],
        ':compatibility' => $data['compatibility'] ?? '',
        ':price' => $data['price'],
        ':stock' => $data['Stocks'],
        ':category' => $data['category']
    ]);
    
    echo json_encode(['success' => true]);
    
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