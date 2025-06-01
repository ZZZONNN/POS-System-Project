
<?php
header('Content-Type: application/json');
ini_set('display_errors', 0);

// Create debug log
file_put_contents('debug.log', "\n[" . date('Y-m-d H:i:s') . "] Update started\n", FILE_APPEND);

try {
    // 1. Connect to database
    $conn = new PDO("mysql:host=localhost;dbname=phone_repair_shop", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    file_put_contents('debug.log', "Connected to database\n", FILE_APPEND);

    // 2. Get and validate input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data || !isset($data['updates'])) {
        throw new Exception("Invalid input data");
    }

    file_put_contents('debug.log', "Received data: " . print_r($data, true) . "\n", FILE_APPEND);

    // 3. Start transaction
    $conn->beginTransaction();
    file_put_contents('debug.log', "Transaction started\n", FILE_APPEND);

    // 4. Prepare update statement
    $stmt = $conn->prepare("UPDATE products SET stock = stock + :quantity WHERE name = :name");
    
    // 5. Execute updates
    $results = [];
    foreach ($data['updates'] as $item) {
        $name = trim($item['name']);
        $quantity = (int)$item['addStock'];
        
        // Get current stock first
        $current = $conn->query("SELECT stock FROM products WHERE name = " . $conn->quote($name))->fetchColumn();
        file_put_contents('debug.log', "Updating $name (Current: $current) + $quantity\n", FILE_APPEND);
        
        // Execute update
        $stmt->execute([':name' => $name, ':quantity' => $quantity]);
        $affected = $stmt->rowCount();
        
        // Verify update
        $new = $conn->query("SELECT stock FROM products WHERE name = " . $conn->quote($name))->fetchColumn();
        $results[] = [
            'name' => $name,
            'old' => $current,
            'new' => $new,
            'affected' => $affected
        ];
        
        file_put_contents('debug.log', "Result: " . print_r(end($results), true) . "\n", FILE_APPEND);
    }

    // 6. Commit changes
    $conn->commit();
    file_put_contents('debug.log', "Changes committed\n", FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'message' => 'Database updated successfully',
        'results' => $results
    ]);

} catch(PDOException $e) {
    // Rollback on error
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
        file_put_contents('debug.log', "Transaction rolled back\n", FILE_APPEND);
    }
    
    file_put_contents('debug.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
}
?>