// SIDE NAV KO - Leave unchanged as requested
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

// TABS JS SCRIPT
function openChart(evt, chartName) {
  var i, tabcontent, tabbutton;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tabbutton = document.getElementsByClassName("tabbutton");
  for (i = 0; i < tabbutton.length; i++) {
    tabbutton[i].className = tabbutton[i].className.replace(" active", "");
  }
  document.getElementById(chartName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  // Set default tab
  document.getElementById("defaultOpen").click();
  
  // Initialize all chart contexts
  const chartContexts = {};
  const chartIds = [
    'inventoryChart', 'samsungChart', 'iphoneChart', 'oppoChart', 
    'vivoChart', 'huaweiChart', 'otherChart', 'weeksalesChart',
    'brandsalesChart', 'unitChart', 'capacityChart', 'restockChart',
    'monthsalesChart', 'yearsalesChart'
  ];

  // Initialize chart contexts
  chartIds.forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      chartContexts[id] = canvas.getContext('2d');
      // Clear canvas before use
      canvas.width = canvas.width;
    }
  });

  // Color schemes
  const colors = {
    brands: {
      samsung: '#1976d2',
      iphone: '#f03c94',
      oppo: '#28a745',
      vivo: '#2c22c1',
      huawei: '#dc3545',
      other: '#808080'
    },
    status: {
      stock: '#28a745',
      sold: '#dc3545'
    }
  };

  // Store chart instances
  const charts = {};

  // Enhanced safe chart update function
  function safeChartUpdate(chartId, ctx, config) {
    try {
      // Check if canvas exists
      const canvas = document.getElementById(chartId);
      if (!canvas) {
        console.error(`Canvas element not found: ${chartId}`);
        return;
      }

      // Destroy existing chart if it exists
      if (charts[chartId]) {
        try {
          charts[chartId].destroy();
        } catch (e) {
          console.warn(`Error destroying chart ${chartId}:`, e);
        }
        charts[chartId] = null;
      }

      // Reset canvas dimensions to clear it
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Create new chart if context exists
      if (ctx) {
        charts[chartId] = new Chart(ctx, config);
      }
    } catch (error) {
      console.error(`Error updating chart ${chartId}:`, error);
    }
  }

  // Fetch data from server
  async function fetchData() {
    try {
      console.log('Fetching data...');
      const [inventoryRes, salesRes] = await Promise.all([
        fetch('get_inventory.php'),
        fetch('Fetch_Sales.php')
      ]);
      
      if (!inventoryRes.ok || !salesRes.ok) {
        const errorText = await inventoryRes.text();
        console.error('Fetch error:', errorText);
        throw new Error('Failed to fetch data');
      }
      
      const inventoryData = await inventoryRes.json();
      const salesData = await salesRes.json();
      
      console.log('Inventory data:', inventoryData);
      console.log('Sales data:', salesData);
      
      return {
        inventory: inventoryData.success ? inventoryData.data : [],
        sales: salesData.success ? salesData.data : []
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      showErrorMessage('Failed to load data. Please try again.');
      return { inventory: [], sales: [] };
    }
  }

  // Process and display all data
  async function updateAllCharts() {
    try {
      console.log('Updating charts...');
      const { inventory, sales } = await fetchData();
      
      // Process inventory data
      const inventoryStats = processInventoryData(inventory);
      updateInventoryCharts(inventoryStats);
      
      // Process sales data
      const salesStats = processSalesData(sales);
      updateSalesCharts(salesStats);
      
      // Update overview table
      updateOverviewTable(sales);
      
      // Update summary section
      updateSummarySection(inventoryStats, salesStats);
      
    } catch (error) {
      console.error('Error updating charts:', error);
      showErrorMessage('Error displaying data. Check console for details.');
    }
  }

  function processInventoryData(inventory) {
    const byCategory = {};
    const byBrand = {};
    let totalStock = 0;
    
    inventory.forEach(item => {
      // Group by category
      if (item.category) {
        byCategory[item.category] = (byCategory[item.category] || 0) + (parseInt(item.Stocks) || 0);
      }
      
      // Group by brand
      const brand = extractBrand(item.compatibility);
      if (!byBrand[brand]) {
        byBrand[brand] = [];
      }
      byBrand[brand].push({
        name: item.name,
        stock: parseInt(item.Stocks) || 0
      });
      
      totalStock += parseInt(item.Stocks) || 0;
    });
    
    return { byCategory, byBrand, totalStock };
  }

  function processSalesData(sales) {
    const byBrand = {};
    const byDate = {};
    const byMonth = {};
    const byYear = {};
    const topSales = [];
    let totalSales = 0;
    let totalItems = 0;
    
    sales.forEach(sale => {
      // Ensure total is a number
      const saleTotal = parseFloat(sale.total) || 0;
      
      // Group by brand
      const brand = extractBrand(sale.compatibility);
      byBrand[brand] = (byBrand[brand] || 0) + saleTotal;
      
      try {
        const date = new Date(sale.date);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        
        // Group by date
        const dateStr = date.toLocaleDateString();
        byDate[dateStr] = (byDate[dateStr] || 0) + saleTotal;
        
        // Group by month
        const monthStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}`;
        byMonth[monthStr] = (byMonth[monthStr] || 0) + saleTotal;
        
        // Group by year
        const yearStr = date.getFullYear().toString();
        byYear[yearStr] = (byYear[yearStr] || 0) + saleTotal;
      } catch (e) {
        console.warn('Invalid date format:', sale.date);
      }
      
      // Track top sales
      topSales.push({
        name: sale.name || 'Unknown Product',
        total: saleTotal,
        date: sale.date || 'Unknown Date'
      });
      
      totalSales += saleTotal;
      totalItems += parseInt(sale.quantity) || 0;
    });
    
    // Sort top sales
    topSales.sort((a, b) => b.total - a.total);
    
    return { 
      byBrand, 
      byDate, 
      byMonth, 
      byYear, 
      topSales: topSales.slice(0, 3),
      totalSales,
      totalItems,
      totalTransactions: sales.length
    };
  }

  function extractBrand(compatibility) {
    if (!compatibility) return 'Other';
    const brandMatch = compatibility.match(/^(Samsung|iPhone|Oppo|Vivo|Huawei)/i);
    return brandMatch ? brandMatch[0] : 'Other';
  }

  function updateInventoryCharts({ byCategory, byBrand, totalStock }) {
    // Main inventory by category chart
    if (chartContexts['inventoryChart']) {
      const categoryLabels = Object.keys(byCategory);
      const categoryData = Object.values(byCategory);
      
      if (categoryLabels.length > 0) {
        safeChartUpdate('inventoryChart', chartContexts['inventoryChart'], {
          type: "bar",
          data: {
            labels: categoryLabels,
            datasets: [{
              label: 'Stock Quantity',
              data: categoryData,
              backgroundColor: categoryLabels.map((_, i) => 
                Object.values(colors.brands)[i % Object.values(colors.brands).length]
              )
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }
        });
      }
    }
    
    // Brand-specific charts
    Object.keys(byBrand).forEach(brand => {
      const chartId = brand.toLowerCase() + 'Chart';
      const ctx = chartContexts[chartId];
      const items = byBrand[brand];
      
      if (items.length > 0 && ctx) {
        safeChartUpdate(chartId, ctx, {
          type: 'bar',
          data: {
            labels: items.map(item => item.name.substring(0, 20)),
            datasets: [{
              label: 'Stock',
              data: items.map(item => item.stock),
              backgroundColor: colors.brands[brand.toLowerCase()] || colors.brands.other
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
              x: { display: items.length <= 10 },
              y: { beginAtZero: true }
            }
          }
        });
      }
    });
    
    // Inventory capacity chart
    if (chartContexts['capacityChart']) {
      safeChartUpdate('capacityChart', chartContexts['capacityChart'], {
        type: 'doughnut',
        data: {
          labels: ['Used', 'Available'],
          datasets: [{
            data: [totalStock, Math.max(0, 100 - totalStock)],
            backgroundColor: [colors.status.stock, '#e9ecef']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  function updateSalesCharts({ byBrand, byDate, byMonth, byYear, topSales }) {
    // Weekly sales chart
    if (chartContexts['weeksalesChart']) {
      const dates = Object.keys(byDate).sort();
      
      if (dates.length > 0) {
        safeChartUpdate('weeksalesChart', chartContexts['weeksalesChart'], {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: 'Daily Sales (₱)',
              data: dates.map(date => byDate[date]),
              borderColor: colors.status.sold,
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
    
    // Brand sales chart
    const brandLabels = Object.keys(byBrand);
    if (brandLabels.length > 0 && chartContexts['brandsalesChart']) {
      safeChartUpdate('brandsalesChart', chartContexts['brandsalesChart'], {
        type: 'bar',
        data: {
          labels: brandLabels,
          datasets: [{
            label: 'Sales by Brand (₱)',
            data: brandLabels.map(brand => byBrand[brand]),
            backgroundColor: brandLabels.map(brand => 
              colors.brands[brand.toLowerCase()] || colors.brands.other
            )
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Monthly sales chart
    const months = Object.keys(byMonth).sort();
    if (months.length > 0 && chartContexts['monthsalesChart']) {
      safeChartUpdate('monthsalesChart', chartContexts['monthsalesChart'], {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Sales (₱)',
            data: months.map(month => byMonth[month]),
            backgroundColor: colors.status.sold
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Yearly sales chart
    const years = Object.keys(byYear).sort();
    if (years.length > 0 && chartContexts['yearsalesChart']) {
      safeChartUpdate('yearsalesChart', chartContexts['yearsalesChart'], {
        type: 'bar',
        data: {
          labels: years,
          datasets: [{
            label: 'Yearly Sales (₱)',
            data: years.map(year => byYear[year]),
            backgroundColor: colors.status.sold
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Update top sales list
    const topSalesContainer = document.querySelector('.analyticscontainer ul');
    if (topSalesContainer) {
      topSalesContainer.innerHTML = topSales.length > 0 ? 
        topSales.map(sale => `
          <li>
            <b>₱${sale.total.toFixed(2)}</b><br>
            ${sale.name}<br>
            <small>${new Date(sale.date).toLocaleDateString()}</small>
          </li>
        `).join('') : 
        '<li>No sales data available</li>';
    }
  }

  function updateOverviewTable(salesData) {
    const tbody = document.querySelector('#overviewtab tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!salesData || salesData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" class="no-data">No sales data available</td></tr>';
      return;
    }
    
    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString();
      } catch {
        return '-';
      }
    };
    
    const formatCurrency = (amount) => {
      return amount ? `₱${parseFloat(amount).toFixed(2)}` : '₱0.00';
    };
    
    salesData.forEach(sale => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatDate(sale.date)}</td>
        <td>${sale.name || '-'}</td>
        <td>${formatCurrency(sale.price)}</td>
        <td>${sale.quantity || '0'}</td>
        <td>${formatCurrency(sale.total)}</td>
        <td>${sale.category || '-'}</td>
        <td>${sale.compatibility || '-'}</td>
        <td>${sale.discount_eligible ? 'Yes' : 'No'}</td>
        <td>${sale.colors || '-'}</td>
        <td>${sale.addon || '-'}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function updateSummarySection(inventoryStats, salesStats) {
    // Units sold chart
    if (chartContexts['unitChart']) {
      const totalSold = salesStats.totalItems;
      const totalStock = inventoryStats.totalStock;
      
      safeChartUpdate('unitChart', chartContexts['unitChart'], {
        type: 'doughnut',
        data: {
          labels: ['In Stock', 'Sold'],
          datasets: [{
            data: [totalStock, totalSold],
            backgroundColor: [colors.status.stock, colors.status.sold]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Summary stats
    const summaryContainer = document.querySelector('.right-block');
    if (summaryContainer) {
      let statsDiv = document.querySelector('.summary-stats');
      if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'summary-stats';
        statsDiv.style.padding = '20px';
        summaryContainer.insertBefore(statsDiv, document.querySelector('.unitchartdiv'));
      }
      
      statsDiv.innerHTML = `
        <h3>Sales Summary</h3>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Total Sales:</span>
            <span><b>₱${salesStats.totalSales.toFixed(2)}</b></span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Items Sold:</span>
            <span><b>${salesStats.totalItems}</b></span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Transactions:</span>
            <span><b>${salesStats.totalTransactions}</b></span>
          </div>
        </div>
        <h3>Inventory Summary</h3>
        <div style="display: flex; justify-content: space-between;">
          <span>Total Stock:</span>
          <span><b>${inventoryStats.totalStock}</b></span>
        </div>
      `;
    }
  }

  function showErrorMessage(message) {
    // Remove any existing error messages first
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.content')?.prepend(errorDiv);
  }

  // Initial load
  updateAllCharts();
  
  // Refresh every 5 minutes
  setInterval(updateAllCharts, 300000);
});