<?php
header('Content-Type: application/json');
ini_set('display_errors', 0);

try {
    $conn = new PDO("mysql:host=localhost;dbname=phone_repair_shop", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Build query
    $where = [];
    $params = [];

    if (!empty($_GET['search'])) {
        $where[] = "name LIKE :search";
        $params[':search'] = '%' . $_GET['search'] . '%';
    }

    if (!empty($_GET['category'])) {
        $where[] = "category = :category";
        $params[':category'] = $_GET['category'];
    }

    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $stmt = $conn->prepare("
        SELECT id, name, stock AS Stocks, price, category, 
               compatibility, class, colors, addon 
        FROM products 
        $whereClause
        ORDER BY name
    ");
    
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert numeric fields to proper types
    foreach ($products as &$product) {
        $product['Stocks'] = (int)$product['Stocks'];
        $product['price'] = (float)$product['price'];
    }
    unset($product);

    echo json_encode([
        'success' => true,
        'data' => $products,
        'total' => count($products)
    ]);

} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Application error: ' . $e->getMessage()
    ]);
}
?>