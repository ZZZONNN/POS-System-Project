<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phone_repair_shop";

// Create connection
$conn = new mysqli("localhost", "root", "", "phone_repair_shop");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $category = $_POST['category'];
    $compatibility = $_POST['compatibility'];
    $class = $_POST['class'];
    $colors = $_POST['colors'];
    $addon = $_POST['addon'];
    $stock = $_POST['stock'];
    
    $sql = "INSERT INTO products (name, price, category, compatibility, class, colors, addon, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdsssssi", $name, $price, $category, $compatibility, $class, $colors, $addon, $stock);
    
    if ($stmt->execute()) {
        $message = "Product added successfully!";
    } else {
        $message = "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product</title>
    <link rel="stylesheet" href="Style-Admin-inventory.css">
    <script src="https://kit.fontawesome.com/8d4aa24ab3.js" crossorigin="anonymous"></script>
    <style>
        .form-container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        
        .form-group input, 
        .form-group select, 
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        button[type="submit"] {
            padding: 12px 20px;
            background-color: #0a5b1c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        
        button[type="submit"]:hover {
            background-color: #1c9e38;
        }
        
        .message {
            margin: 15px 0;
            padding: 15px;
            background-color: #dff0d8;
            color: #3c763d;
            border-radius: 4px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Left Column - Menu -->
        <div class="menu">
            <h2>Menu</h2>
            <hr class="separator">
    <a href="javascript:void(0)" class="closebtnko" onclick="closeNavko()">&times;</a>
    <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/ManageProducts/manageinventory.html"> Manage Stocks</a>
    <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/ViewInventory/viewinventoryadmin.html">View Inventory</a>
    <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/ViewSales/View_Sales.html"> View Sales</a>
    <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/ViewAnalytics/View_Analytics.html"> View Analytics</a>
       <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login/admin/AddProduct/add_product.php"> Add Product</a>

  <a href="http://localhost/XYX%20Repair%20Shop%20POS%20System/Login_codes/Login.html">Log Out</a>
        </div>

        <!-- Middle Column - Main Content -->
        <div class="main">
            <div class="title-bar">
                <h2>Add New Product</h2>
            </div>
            
            <?php if (!empty($message)): ?>
                <div class="message"><?php echo $message; ?></div>
            <?php endif; ?>
            
            <div class="form-container">
                <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                    <div class="form-group">
                        <label for="name">Product Name:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="price">Price:</label>
                        <input type="number" id="price" name="price" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Category:</label>
                        <select id="category" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Huawei">Huawei</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Oppo">Oppo</option>
                            <option value="Vivo">Vivo</option>
                            <option value="iPhone">iPhone</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="compatibility">Compatibility:</label>
                        <input type="text" id="compatibility" name="compatibility" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="class">Class:</label>
                        <select id="class" name="class">
                            <option value="Original">Original</option>
                            <option value="Premium">Premium</option>
                            <option value="Regular">Regular</option>
                            <option value="OEM">OEM</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="colors">Colors (comma-separated):</label>
                        <input type="text" id="colors" name="colors" placeholder="Black,White,Blue">
                    </div>
                    
                    <div class="form-group">
                        <label for="addon">Addon/Notes:</label>
                        <textarea id="addon" name="addon" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="stock">Stock Quantity:</label>
                        <input type="number" id="stock" name="stock" min="0" value="0">
                    </div>
                    
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>

        <!-- Right Column - Summary -->
        <div class="summary">
            <div>
                <h2>Quick Stats</h2>
                <div class="cart-item">
                    <h4><u>Recent Activity</u></h4>
                    <p>Last product added: <br><b>iPhone 14 Pro Screen</b></p>
                </div>
                <div class="cart-item">
                    <h4><u>Inventory Status</u></h4>
                    <p>Total products: <b>127</b></p>
                    <p>Low stock items: <b style="color:red">12</b></p>
                </div>
                <div class="cart-item">
                    <h4><u>Categories</u></h4>
                    <ul>
                        <li>Samsung: 32 items</li>
                        <li>iPhone: 28 items</li>
                        <li>Oppo: 19 items</li>
                        <li>Vivo: 15 items</li>
                        <li>Huawei: 18 items</li>
                        <li>Accessories: 15 items</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <?php
    $conn->close();
    ?>
</body>
</html>