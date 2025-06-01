document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const productForm = document.getElementById("product-form");
  const noSelection = document.querySelector(".no-selection");
  const deleteBtn = document.getElementById("delete-product");
  const productGrid = document.querySelector(".product-grid");
  const toggleLowStockBtn = document.getElementById("toggle-low-stock");
  const lowStockPopup = document.getElementById("low-stock-popup");
  const popupOverlay = document.getElementById("popup-overlay");
  const closeLowStockBtn = document.getElementById("close-low-stock");
  const lowStockList = document.getElementById("low-stock-list");
  const sidenav = document.getElementById('mySidenavko');
  const navOverlay = document.getElementById('navOverlay');

  // State variables
  let products = [];
  let selectedProductId = null;

  // Initialize the application
  async function init() {
    await fetchProducts();
    populateCategoryFilter();
    renderProducts();
    setupEventListeners();
  }

  // Fetch products from the backend
  async function fetchProducts() {
    try {
      const response = await fetch('get_inventory.php');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data.success) {
        products = data.data;
      } else {
        console.error('Error fetching products:', data.error);
        products = getFallbackProducts();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      products = getFallbackProducts();
    }
  }

  // Fallback product data if API fails
  function getFallbackProducts() {
    return [
      // Sample fallback data
      { id: 1, name: "Sample Product", price: 100, Stocks: 10, category: "Sample", compatibility: "Universal" }
    ];
  }

  // Populate category filter dropdown
  function populateCategoryFilter() {
    const categories = new Set();
    products.forEach(p => {
      if (p.category) categories.add(p.category.trim());
    });

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    [...categories].sort().forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // Render products to the grid
  function renderProducts(filteredProducts = products) {
    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.dataset.id = product.id;
      
      // Add stock status classes
      if (product.Stocks === 0) {
        card.classList.add("no-stock");
      } else if (product.Stocks <= 100) {
        card.classList.add("low-stock");
      }
      
      // Highlight if selected
      if (selectedProductId === product.id) {
        card.classList.add("selected");
      }

      card.innerHTML = `
        <p><strong>${product.name}</strong></p>
        <p>Category: ${product.category}</p>
        <p>Stock: ${product.Stocks}</p>
        <p>Compatibility: ${product.compatibility || 'N/A'}</p>
      `;

      card.addEventListener("click", () => selectProduct(product.id));
      productGrid.appendChild(card);
    });
  }

  // Select a product to view/edit
  function selectProduct(productId) {
    selectedProductId = productId;
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // Populate form fields
    document.getElementById("edit-name").value = product.name;
    document.getElementById("edit-compatibility").value = product.compatibility || '';
    document.getElementById("edit-price").value = product.price || 0;
    document.getElementById("edit-stock").value = product.Stocks || 0;
    document.getElementById("edit-category").value = product.category || '';

    // Show form and hide "no selection" message
    productForm.style.display = "flex";
    deleteBtn.style.display = "block";
    noSelection.style.display = "none";

    // Update selected state in grid
    document.querySelectorAll(".product-card").forEach(card => {
      card.classList.toggle("selected", parseInt(card.dataset.id) === productId);
    });
  }

  // Filter products based on search and category
  function filterAndRender() {
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query) || 
                         (p.compatibility && p.compatibility.toLowerCase().includes(query));
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });

    renderProducts(filtered);
  }

  // Save product changes
  async function saveProduct(e) {
    e.preventDefault();

    const product = {
      id: selectedProductId,
      name: document.getElementById("edit-name").value.trim(),
      compatibility: document.getElementById("edit-compatibility").value.trim(),
      price: parseFloat(document.getElementById("edit-price").value),
      Stocks: parseInt(document.getElementById("edit-stock").value),
      category: document.getElementById("edit-category").value
    };

    if (!product.name || isNaN(product.price)) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    try {
      const response = await fetch('update_product.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local products array
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          products[index] = { ...products[index], ...product };
        }
        
        // Refresh display
        filterAndRender();
        resetForm();
      } else {
        alert('Failed to update product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  }

  // Delete a product
  async function deleteProduct() {
    if (!selectedProductId || !confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`delete_product.php?id=${selectedProductId}`);
      const data = await response.json();
      
      if (data.success) {
        // Remove from local products array
        products = products.filter(p => p.id !== selectedProductId);
        
        // Refresh display
        filterAndRender();
        resetForm();
      } else {
        alert('Failed to delete product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }

  // Reset the form
  function resetForm() {
    selectedProductId = null;
    productForm.style.display = "none";
    deleteBtn.style.display = "none";
    noSelection.style.display = "block";
    
    // Clear form fields
    productForm.reset();
    
    // Remove selection highlighting
    document.querySelectorAll(".product-card").forEach(card => {
      card.classList.remove("selected");
    });
  }

  // Show low stock items
  function showLowStockItems() {
    const noStockItems = products.filter(p => p.Stocks === 0);
    const lowStockItems = products.filter(p => p.Stocks > 0 && p.Stocks <= 100);
    
    lowStockList.innerHTML = "";

    if (noStockItems.length > 0) {
      const header = document.createElement("li");
      header.innerHTML = `<strong><i class="fas fa-times-circle"></i> Out of Stock (${noStockItems.length})</strong>`;
      lowStockList.appendChild(header);
      
      noStockItems.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-box-open" style="color: #ff0000;"></i> ${p.name} (${p.Stocks})`;
        lowStockList.appendChild(li);
      });
    }

    if (lowStockItems.length > 0) {
      const header = document.createElement("li");
      header.innerHTML = `<strong><i class="fas fa-exclamation-triangle"></i> Low Stock (${lowStockItems.length})</strong>`;
      lowStockList.appendChild(header);
      
      lowStockItems.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-box-open" style="color: #ff9800;"></i> ${p.name} (${p.Stocks})`;
        lowStockList.appendChild(li);
      });
    }

    if (noStockItems.length === 0 && lowStockItems.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No low stock or out of stock items";
      lowStockList.appendChild(li);
    }

    lowStockPopup.classList.add("show");
    popupOverlay.classList.add("show");
  }

  // Close low stock popup
  function closeLowStockPopup() {
    lowStockPopup.classList.remove("show");
    popupOverlay.classList.remove("show");
  }

  // Setup event listeners
  function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener("input", filterAndRender);
    categoryFilter.addEventListener("change", filterAndRender);

    // Form submission
    productForm.addEventListener("submit", saveProduct);

    // Cancel button
    document.querySelector(".cancel-btn").addEventListener("click", resetForm);

    // Delete button
    deleteBtn.addEventListener("click", deleteProduct);

    // Stock quantity controls
    document.querySelector(".increase").addEventListener("click", () => {
      const input = document.getElementById("edit-stock");
      input.value = parseInt(input.value || 0) + 1;
    });

    document.querySelector(".decrease").addEventListener("click", () => {
      const input = document.getElementById("edit-stock");
      const newValue = Math.max(0, parseInt(input.value || 0) - 1);
      input.value = newValue;
    });

    // Low stock popup
    toggleLowStockBtn.addEventListener("click", showLowStockItems);
    closeLowStockBtn.addEventListener("click", closeLowStockPopup);
    popupOverlay.addEventListener("click", closeLowStockPopup);

    // Sidebar navigation
    document.querySelector('#mainko span').addEventListener('click', openNavko);
    navOverlay.addEventListener('click', closeNavko);
  }

  // Sidebar functions
  function openNavko() {
    sidenav.style.width = "250px";
    navOverlay.style.display = 'block';
    document.body.classList.add('sidenav-open');
  }

  function closeNavko() {
    sidenav.style.width = "0";
    navOverlay.style.display = 'none';
    document.body.classList.remove('sidenav-open');
  }

  // Initialize the app
  init();
});