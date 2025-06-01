<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phone_repair_shop";

// Get the input data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input data
if (json_last_error() !== JSON_ERROR_NONE || !$data || !isset($data['cart'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Start transaction
    $conn->beginTransaction();
    
    // Validate and prepare payment details
    $paymentMethod = $data['payment']['method'] ?? 'cash';
    $paymentAmount = $data['payment']['amount'] ?? $data['total'] ?? 0;
    $paymentChange = $data['payment']['change'] ?? 0;
    $paymentDetails = json_encode($data['payment'] ?? []);
    
    // Insert order
    $stmt = $conn->prepare("INSERT INTO orders (order_date, discount, total_amount, payment_method, payment_amount, payment_change, payment_details) 
                           VALUES (NOW(), :discount, :total, :payment_method, :payment_amount, :payment_change, :payment_details)");
    $stmt->execute([
        ':discount' => $data['discount'] ?? 0,
        ':total' => $data['total'] ?? 0,
        ':payment_method' => $paymentMethod,
        ':payment_amount' => $paymentAmount,
        ':payment_change' => $paymentChange,
        ':payment_details' => $paymentDetails
    ]);
    $orderId = $conn->lastInsertId();
    
    // Insert order items and update inventory
    $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, colors) 
                               VALUES (:order_id, :product_id, :quantity, :price, :colors)");
    $updateStmt = $conn->prepare("UPDATE products SET stock = stock - :quantity WHERE id = :product_id AND stock >= :quantity");
    
    foreach ($data['cart'] as $item) {
        // Validate cart item
        if (!isset($item['id'], $item['quantity'], $item['price'], $item['colors'])) {
            throw new Exception("Invalid cart item format");
        }
        
        // Insert order item
        $itemStmt->execute([
            ':order_id' => $orderId,
            ':product_id' => $item['id'],
            ':quantity' => $item['quantity'],
            ':price' => $item['price'],
            ':colors' => $item['colors']
        ]);
        
        // Update inventory
        $updateStmt->execute([
            ':quantity' => $item['quantity'],
            ':product_id' => $item['id']
        ]);
        
        if ($updateStmt->rowCount() === 0) {
            throw new Exception("Insufficient stock for product ID: " . $item['id']);
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode(['success' => true, 'order_id' => $orderId]);
    
} catch(PDOException $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>