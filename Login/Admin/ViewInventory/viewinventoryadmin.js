// Navigation functions
function openNavko() {
  document.getElementById("mySidenavko").style.width = "250px";
  document.getElementById("mainko").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNavko() {
  document.getElementById("mySidenavko").style.width = "0";
  document.getElementById("mainko").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

// Main inventory functions
function filterProducts() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;
  fetchInventoryData(selectedCategory, query);
}

function fetchInventoryData(category = '', search = '') {
  let url = 'get_inventory.php?';
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  
  url += params.toString();

  fetch(url)
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return response.text().then(text => {
          throw new Error(`Invalid response: ${text.substring(0, 100)}...`);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        renderInventory(data.data);
        // Only populate categories if we're doing the initial load
        if (!category && !search) {
          populateCategoryFilter(data.data);
        }
      } else {
        showError(data.message || 'Unknown error');
      }
    })
    .catch(error => {
      showError(error.message);
      console.error('Fetch error:', error);
    });
}

function showError(message) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = `
    <div class="error-message">
      <p>Error loading inventory</p>
      <small>${message}</small>
    </div>
  `;
}

function renderInventory(inventory) {
  console.log("Rendering inventory:", inventory);
  const productGrid = document.querySelector('.product-grid');
  const lowStockList = document.getElementById('lowStockList');
  
  productGrid.innerHTML = '';
  lowStockList.innerHTML = '';

  if (!inventory || inventory.length === 0) {
    productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
    lowStockList.innerHTML = '<li class="none">No low stock items found</li>';
    return;
  }

  inventory.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    
    const stock = parseInt(item.Stocks) || 0;
    const price = parseFloat(item.price) || 0;
    
    if (stock <= 5) card.classList.add('low-stock');
    
    // Create tooltip content only if there's additional info
    let tooltipContent = '';
    const hasAdditionalInfo = item.compatibility || item.class || item.colors || item.addon;
    
    if (hasAdditionalInfo) {
      // Determine position (bottom for first 8 items, top for others)
      const tooltipPosition = index < 8 ? 'bottom' : 'top';
      
      tooltipContent = `
        <div class="tooltip ${tooltipPosition}">
          ${item.compatibility ? `<div class="tooltip-row"><span class="tooltip-label">Compatibility:</span><span class="tooltip-value">${item.compatibility}</span></div>` : ''}
          ${item.class ? `<div class="tooltip-row"><span class="tooltip-label">Class:</span><span class="tooltip-value">${item.class}</span></div>` : ''}
          ${item.colors ? `<div class="tooltip-row"><span class="tooltip-label">Colors:</span><span class="tooltip-value">${item.colors}</span></div>` : ''}
          ${item.addon ? `<div class="tooltip-row"><span class="tooltip-label">Addon:</span><span class="tooltip-value">${item.addon}</span></div>` : ''}
        </div>
      `;
    }
    
    card.innerHTML = `
      <h4>${item.name}</h4>
      <div>Price: ₱${price.toFixed(2)}</div>
      <div>Category: ${item.category}</div>
      <div>Stock: <span class="stock-${stock <= 0 ? 'out' : stock <= 5 ? 'low' : 'normal'}">${stock}</span></div>
      ${tooltipContent}
    `;
    
    productGrid.appendChild(card);

    const LOW_STOCK_THRESHOLD = 100;
    
    if (stock <= LOW_STOCK_THRESHOLD) {
      const li = document.createElement('li');
      
      if (stock === 0) {
        li.className = 'out';
        li.textContent = `🛑 ${item.name} - OUT OF STOCK`;
      } 
      else if (stock <= 3) {
        li.className = 'low';
        li.textContent = `⚠️ ${item.name} - ${stock} remaining (LOW)`;
      }
      else {
        li.className = 'warning';
        li.textContent = `🔶 ${item.name} - ${stock} remaining`;
      }
      
      lowStockList.appendChild(li);
    }
  });
  
  if (lowStockList.children.length === 0) {
    lowStockList.innerHTML = '<li class="none">No low stock items found</li>';
  }
}

function populateCategoryFilter(inventory) {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set();
  
  // Add all unique categories
  inventory.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  
  // Create options
  const options = ['<option value="">All Categories</option>'];
  categories.forEach(category => {
    options.push(`<option value="${category}">${category}</option>`);
  });
  
  categoryFilter.innerHTML = options.join('');
}

async function orderLowStocks() {
  try {
    // 1. Get low stock items
    const lowStockItems = Array.from(document.querySelectorAll('#lowStockList li:not(.none)'))
      .map(li => {
        const match = li.textContent.match(/(.*) - (\d+)/);
        return match ? { 
          name: match[1].replace(/[🔶⚠️🛑]/g, '').trim(), // Remove emojis
          currentStock: parseInt(match[2]) 
        } : null;
      })
      .filter(Boolean);

    if (!lowStockItems.length) {
      alert("No low stock items to order!");
      return;
    }

    // 2. Confirm action
    if (!confirm(`Add 1000 units to ${lowStockItems.length} low-stock items?`)) return;

    // 3. Prepare update data
    const updateData = {
      updates: lowStockItems.map(item => ({
        name: item.name,
        addStock: 1000
      }))
    };

    console.log("Sending update:", updateData);

    // 4. Send to server
    const response = await fetch('update_stocks.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    console.log("Update result:", result);

    // 5. Handle response
    if (result.success) {
      // Verify each update
      const failedUpdates = result.results.filter(r => r.affected === 0);
      
      if (failedUpdates.length) {
        alert(`Warning: ${failedUpdates.length} items failed to update\n` + 
              failedUpdates.map(f => f.name).join(', '));
      }
      
      // Refresh data - this will update both main grid and low stock list
      await fetchInventoryData();
      
      // Show receipt
      generateReceipt(lowStockItems, result.results);
    } else {
      throw new Error(result.message || 'Update failed');
    }

  } catch (error) {
    console.error("Order failed:", error);
    alert(`Error: ${error.message}\nCheck console for details`);
  }
}

function generateReceipt(items, dbResults) {
  const receiptList = document.getElementById('receiptList');
  const modal = document.getElementById('receiptModal');
  const overlay = document.getElementById('receiptOverlay');
  
  receiptList.innerHTML = '';
  
  // Add header
  const header = document.createElement('li');
  header.innerHTML = `
    <strong>PRODUCT NAME</strong>
    <strong>QTY ADDED</strong>
    <strong>NEW STOCK</strong>
  `;
  header.style.display = 'grid';
  header.style.gridTemplateColumns = '2fr 1fr 1fr';
  header.style.fontWeight = 'bold';
  header.style.borderBottom = '2px solid #000';
  header.style.marginBottom = '10px';
  header.style.paddingBottom = '5px';
  receiptList.appendChild(header);
  
  // Add items
  items.forEach(item => {
    const result = dbResults.find(r => r.name === item.name) || {};
    const li = document.createElement('li');
    li.style.display = 'grid';
    li.style.gridTemplateColumns = '2fr 1fr 1fr';
    li.style.marginBottom = '5px';
    li.innerHTML = `
      <span>${item.name}</span>
      <span>1000</span>
      <span>${(result.new || item.currentStock + 1000)}</span>
    `;
    receiptList.appendChild(li);
  });
  
  // Add footer
  const footer = document.createElement('li');
  footer.innerHTML = `
    <strong>Total Items:</strong>
    <strong>${items.length}</strong>
  `;
  footer.style.display = 'grid';
  footer.style.gridTemplateColumns = '1fr 1fr';
  footer.style.marginTop = '15px';
  footer.style.paddingTop = '10px';
  footer.style.borderTop = '2px solid #000';
  receiptList.appendChild(footer);
  
  // Show modal
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeReceipt() {
  document.getElementById('receiptModal').style.display = 'none';
  document.getElementById('receiptOverlay').style.display = 'none';
}

function printReceipt() {
  const receiptContent = document.getElementById('receiptList').cloneNode(true);
  const printWindow = window.open('', '', 'width=600,height=600');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Stock Order Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 30px; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 5px; }
        .header { 
          display: grid; 
          grid-template-columns: 2fr 1fr 1fr; 
          font-weight: bold; 
          border-bottom: 2px solid #000; 
          margin-bottom: 10px; 
          padding-bottom: 5px; 
        }
        .item { 
          display: grid; 
          grid-template-columns: 2fr 1fr 1fr; 
        }
        .footer { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          margin-top: 15px; 
          padding-top: 10px; 
          border-top: 2px solid #000; 
        }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Low Stock Items Report</h1>
      <ul>${receiptContent.innerHTML}</ul>
      <p style="text-align: center; margin-top: 30px;">
        Generated on ${new Date().toLocaleString()}
      </p>
      <button onclick="window.print()" style="
        display: block; 
        margin: 20px auto; 
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">Print Report</button>
    </body>
    </html>
  `);
  
  printWindow.document.close();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load initial data
  fetchInventoryData();
  
  // Set up event listeners
  document.getElementById('searchInput').addEventListener('input', function() {
    filterProducts();
  });
  
  document.getElementById('categoryFilter').addEventListener('change', function() {
    filterProducts();
  });
  
  // Close receipt when clicking overlay
  document.getElementById('receiptOverlay').addEventListener('click', closeReceipt);
  
  console.log("Inventory system initialized");
});