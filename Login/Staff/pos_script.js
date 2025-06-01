// Updates to pos_script.js

document.addEventListener('DOMContentLoaded', function() {
    // Load products from PHP
    loadProducts();
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    
    // Discount checkbox
    document.getElementById('discountCheckbox').addEventListener('change', updateTotals);
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', showPaymentModal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('paymentModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});

let products = [];
let cart = [];

// Add this function to show the payment modal
function showPaymentModal() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = parseFloat(document.getElementById('totalAmount').textContent);
    
    // Remove existing modal if it exists
    const existingModal = document.getElementById('paymentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modalHTML = `
    <div id="paymentModal" class="modal">
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <h2>Payment</h2>
            <div class="payment-details">
                <p>Total Amount: ₱<span id="modalTotalAmount">${total.toFixed(2)}</span></p>
                
                <div class="payment-method">
                    <h3>Select Payment Method</h3>
                    <div class="payment-options">
                        <label>
                            <input type="radio" name="paymentMethod" value="cash" checked> Cash
                        </label>
                        <label>
                            <input type="radio" name="paymentMethod" value="card"> Card
                        </label>
                    </div>
                </div>
                
                <div id="cashPaymentSection">
                    <div class="form-group">
                        <label for="cashAmount">Cash Amount:</label>
                        <input type="number" id="cashAmount" min="${total}" step="0.01" value="${total.toFixed(2)}">
                    </div>
                    <p>Change: ₱<span id="changeAmount">0.00</span></p>
                </div>
                
                <div id="cardPaymentSection" style="display:none;">
                    <div class="form-group">
                        <label for="cardNumber">Card Number:</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiryDate">Expiry Date:</label>
                            <input type="text" id="expiryDate" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV:</label>
                            <input type="text" id="cvv" placeholder="123">
                        </div>
                    </div>
                </div>
                
                <button id="processPaymentBtn" class="process-payment-btn">Process Payment</button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for the payment modal
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentMethod);
    });
    
    document.getElementById('cashAmount').addEventListener('input', calculateChange);
    document.getElementById('processPaymentBtn').addEventListener('click', processPayment);
    
    // Show the modal
    document.getElementById('paymentModal').style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Rest of your existing payment functions...

function togglePaymentMethod() {
    const cashSection = document.getElementById('cashPaymentSection');
    const cardSection = document.getElementById('cardPaymentSection');
    
    if (document.querySelector('input[name="paymentMethod"]:checked').value === 'cash') {
        cashSection.style.display = 'block';
        cardSection.style.display = 'none';
    } else {
        cashSection.style.display = 'none';
        cardSection.style.display = 'block';
    }
}

function calculateChange() {
    const totalAmount = parseFloat(document.getElementById('modalTotalAmount').textContent);
    const cashAmount = parseFloat(document.getElementById('cashAmount').value) || 0;
    const change = cashAmount - totalAmount;
    
    document.getElementById('changeAmount').textContent = change >= 0 ? change.toFixed(2) : '0.00';
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const totalAmount = parseFloat(document.getElementById('modalTotalAmount').textContent);
    
    let paymentValid = false;
    let paymentDetails = {};
    
    if (paymentMethod === 'cash') {
        const cashAmount = parseFloat(document.getElementById('cashAmount').value) || 0;
        if (cashAmount >= totalAmount) {
            paymentValid = true;
            paymentDetails = {
                method: 'cash',
                amount: cashAmount,
                change: cashAmount - totalAmount
            };
        } else {
            alert('Insufficient cash amount!');
        }
    } else if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (cardNumber && expiryDate && cvv) {
            // In a real system, you would validate the card details
            paymentValid = true;
            paymentDetails = {
                method: 'card',
                cardNumber: cardNumber.slice(-4), // Only store last 4 digits
                expiryDate: expiryDate
            };
        } else {
            alert('Please fill in all card details!');
        }
    }
    
    if (paymentValid) {
        processCheckout(paymentDetails);
    }
}

function processCheckout(paymentDetails) {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const discount = document.getElementById('discountCheckbox').checked ? 20 : 0;
    const total = parseFloat(document.getElementById('totalAmount').textContent);
    
    // Show loading state
    const processBtn = document.getElementById('processPaymentBtn');
    const originalText = processBtn.textContent;
    processBtn.disabled = true;
    processBtn.textContent = 'Processing...';
    
    fetch('process_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                colors: item.color
            })),
            discount: discount,
            total: total,
            payment: paymentDetails
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            closeModal();
            generateReceipt(data.order_id, paymentDetails);
            cart = [];
            updateCartDisplay();
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error processing order: ' + error.message);
    })
    .finally(() => {
        processBtn.disabled = false;
        processBtn.textContent = originalText;
    });
}

function generateReceipt(orderId, paymentDetails) {
    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    // Calculate totals
    const subtotal = parseFloat(document.getElementById('subtotal').textContent);
    const discount = parseFloat(document.getElementById('discountAmount').textContent);
    const total = parseFloat(document.getElementById('totalAmount').textContent);
    
    // Create receipt HTML
    let receiptHTML = `
    <div id="receiptModal" class="modal">
        <div class="modal-content receipt">
            <span class="close-button" onclick="document.getElementById('receiptModal').remove()">&times;</span>
            <div class="receipt-content">
                <h2 class="receipt-header">XYX Phone Repair Shop</h2>
                <p class="receipt-address">123 Main Street, Your City</p>
                <p class="receipt-contact">Tel: (123) 456-7890</p>
                
                <div class="receipt-details">
                    <p><strong>Order #:</strong> ${orderId}</p>
                    <p><strong>Date:</strong> ${dateStr}</p>
                    <p><strong>Time:</strong> ${timeStr}</p>
                </div>
                
                <table class="receipt-items">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Color</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
    // Add each item
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>₱${item.price.toFixed(2)}</td>
                <td>₱${itemTotal.toFixed(2)}</td>
            </tr>`;
    });
    
    // Add payment details and totals
    receiptHTML += `
                    </tbody>
                </table>
                
                <div class="receipt-summary">
                    <p><strong>Subtotal:</strong> ₱${subtotal.toFixed(2)}</p>`;
    
    if (discount > 0) {
        receiptHTML += `<p><strong>Discount (20%):</strong> ₱${discount.toFixed(2)}</p>`;
    }
    
    receiptHTML += `<p class="receipt-total"><strong>Total:</strong> ₱${total.toFixed(2)}</p>`;
    
    // Payment method details
    receiptHTML += `<p><strong>Payment Method:</strong> ${paymentDetails.method === 'cash' ? 'Cash' : 'Card'}</p>`;
    
    if (paymentDetails.method === 'cash') {
        receiptHTML += `
            <p><strong>Cash Amount:</strong> ₱${paymentDetails.amount.toFixed(2)}</p>
            <p><strong>Change:</strong> ₱${paymentDetails.change.toFixed(2)}</p>`;
    } else {
        receiptHTML += `<p><strong>Card Number:</strong> **** **** **** ${paymentDetails.cardNumber}</p>`;
    }
    
    // Close receipt HTML
    receiptHTML += `
                </div>
                
                <div class="receipt-footer">
                    <p>Thank you for your purchase!</p>
                    <button onclick="printReceipt()">Print Receipt</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add receipt to page
    document.body.insertAdjacentHTML('beforeend', receiptHTML);
    document.getElementById('receiptModal').style.display = 'block';
}

function printReceipt() {
    const receiptContent = document.querySelector('.receipt-content').cloneNode(true);
    const printBtn = receiptContent.querySelector('button');
    if (printBtn) {
        printBtn.remove();
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: Arial, sans-serif; width: 300px; margin: 0 auto; }
        .receipt-header { text-align: center; margin-bottom: 5px; }
        .receipt-address, .receipt-contact { text-align: center; margin: 5px 0; font-size: 14px; }
        .receipt-details { margin: 15px 0; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; }
        .receipt-items { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .receipt-items th, .receipt-items td { text-align: left; padding: 5px; }
        .receipt-summary { margin: 15px 0; }
        .receipt-total { font-size: 18px; margin-top: 10px; }
        .receipt-footer { text-align: center; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(receiptContent.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
    };
}

function loadProducts() {
    fetch('get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // Display error to user
            document.getElementById('productGrid').innerHTML = 
                '<div class="error">Error loading products. Please try again later.</div>';
        });
}

function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products found.</div>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-title">${product.name}</div>
            <div class="product-price">₱${parseFloat(product.price).toFixed(2)}</div>
            ${product.colors ? `<select class="color-select" data-product-id="${product.id}">
                ${product.colors.split(',').map(color => `<option>${color.trim()}</option>`).join('')}
            </select>` : ''}
            <div class="product-details">
                <p>Category: ${product.category}</p>
                <p>Compatibility: ${product.compatibility}</p>
                ${product.addon ? `<p>Addon: ${product.addon}</p>` : ''}
            </div>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event delegation for dynamically created buttons
    productGrid.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            addToCart(event);
        }
    });
}

function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                         product.compatibility.toLowerCase().includes(searchTerm);
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  displayProducts(filteredProducts);
}

function addToCart(event) {
  console.log('Add to Cart button clicked');
  
  try {
    const productId = parseInt(event.target.getAttribute('data-product-id'));
    console.log('Product ID:', productId);
    
    const product = products.find(p => p.id === productId);
    console.log('Found product:', product);
    
    if (!product) {
      console.error('Product not found in products array');
      return;
    }
    
    const productCard = event.target.closest('.product-card');
    const colorSelect = productCard.querySelector('.color-select');
    const color = colorSelect ? colorSelect.value : 'N/A';
    console.log('Selected color:', color);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId && item.color === color);
    
    if (existingItem) {
      console.log('Increasing quantity of existing item');
      existingItem.quantity += 1;
    } else {
      console.log('Adding new item to cart');
      cart.push({
        id: productId,
        name: product.name,
        price: parseFloat(product.price), // Ensure price is a number
        color: color,
        quantity: 1
      });
    }
    
    console.log('Updated cart:', cart);
    updateCartDisplay();
  } catch (error) {
    console.error('Error in addToCart:', error);
  }
}

function updateCartDisplay() {
  const cartItemsElement = document.getElementById('cartItems');
  cartItemsElement.innerHTML = '';
  
  cart.forEach((item, index) => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <div class="cart-item-info">
        <div>${item.name}</div>
        <div>${item.color}</div>
      </div>
      <input type="number" value="${item.quantity}" min="1" data-index="${index}">
      <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
      <div class="remove" data-index="${index}">×</div>
    `;
    cartItemsElement.appendChild(cartItemElement);
  });
  
  // Add event listeners to quantity inputs and remove buttons
  document.querySelectorAll('.cart-item input').forEach(input => {
    input.addEventListener('change', updateCartQuantity);
  });
  
  document.querySelectorAll('.remove').forEach(button => {
    button.addEventListener('click', removeFromCart);
  });
  
  updateTotals();
}

function updateCartQuantity(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  const newQuantity = parseInt(event.target.value);
  
  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
    updateCartDisplay();
  }
}

function removeFromCart(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountCheckbox = document.getElementById('discountCheckbox');
  const discount = discountCheckbox.checked ? subtotal * 0.20 : 0; // 20% discount
  const total = subtotal - discount;
  
  document.getElementById('itemCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('discountAmount').textContent = discount.toFixed(2);
  document.getElementById('totalAmount').textContent = total.toFixed(2);
}