const dataset = [];

fetch("Fetch_Sales.php")
  .then((res) => res.json())
  .then((json) => {
    if (!Array.isArray(json.data)) {
      throw new Error("Invalid or missing 'data' array from PHP");
    }

    dataset.length = 0;
    dataset.push(...json.data);
    renderTable(dataset);
    populateDropdowns();
  })

  .catch((error) => {
    console.error("Error loading sales data:", error);
    document.getElementById("errorMessage").textContent =
      "Failed to load sales data.";
  });

let filters = {
  year: null,
  month: null,
  week: null,
  category: null,
  search: "",
};

function renderTable(data) {
  const productGrid = document.getElementById("productGrid");
  const errorMessage = document.getElementById("errorMessage");
  const itemsSoldSpan = document.getElementById("ItemsSold");
  const revenueSpan = document.getElementById("Revenue");
  const estimatedSpan = document.getElementById("EstimatedSales");
  const finalSalesSpan = document.getElementById("FinalSales");

  productGrid.innerHTML = "";
  errorMessage.textContent = "";

  let totalItems = 0;
  let totalRevenue = 0;
  let estimatedTotal = 0;
  let finalSales = 0;

  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No sales records found.");
    }

    data.forEach((item) => {
      const discountRate = item.discount_eligible ? 0.2 : 0;
      const discountedTotal = Number(item.total || 0) * (1 - discountRate);

      totalItems += item.quantity;
      totalRevenue += Number(item.total || 0) ;
      estimatedTotal += discountedTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.name}</td>
        <td>${item.quantity || 0}</td>
        <td>₱${Number(item.price || 0).toFixed(2)}</td>
        <td>₱${Number(item.total || 0).toFixed(2)}</td>
        <td>${item.category || "-"}</td>
        <td>${item.compatibility || "-"}</td>
        <td>${item.discount_eligible ? "" : "None"}</td>
        <td>${item.colors || "-"}</td>
        <td>${item.addon || "-"}</td>
      `;
      productGrid.appendChild(row);
    });
    finalSales = estimatedTotal / 1.12;

    itemsSoldSpan.textContent = totalItems.toLocaleString();
    revenueSpan.textContent = totalRevenue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    estimatedSpan.textContent = estimatedTotal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    finalSalesSpan.textContent = finalSales.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    errorMessage.textContent = error.message;
    // Reset summary on error
    itemsSoldSpan.textContent = "n/a";
    revenueSpan.textContent = "00.00";
    estimatedSpan.textContent = "00.00";
    finalSalesSpan.textContent = "00.00";
  }
}

function applyFilters() {
  let filtered = [...dataset];

  if (filters.year) {
    filtered = filtered.filter((item) => item.date.startsWith(filters.year));
  }

  if (filters.month) {
    filtered = filtered.filter((item) => {
      const itemMonth = item.date.split("-")[1];
      return itemMonth === filters.month;
    });
  }

  if (filters.category) {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

if (filters.week) {
  filtered = filtered.filter((item) => {
    return getWeekOfMonth(item.date) === filters.week;
  });
}

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
  }

  renderTable(filtered);
}

// Toggle dropdown visibility
function toggleDropdown(id) {
  const menu = document.getElementById(id);
  const isVisible = menu.style.display === "block";

  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });

  if (!isVisible) {
    menu.style.display = "block";
  }
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (event) {
  const isDropdown = event.target.closest(".dropdown");
  if (!isDropdown) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.style.display = "none";
    });
  }
});

function setButtonLabel(id, text) {
  const button = document.getElementById(id);
  if (button) {
    button.textContent = text;
  }
}

// Populate dropdowns with selections
function populateDropdowns() {
  const printBtn = document.getElementById("printButton");
  const helpText = document.getElementById("printHelpText");

  const years = [...new Set(dataset.map((d) => d.date.split("-")[0]))];
  const months = [...new Set(dataset.map((d) => d.date.split("-")[1]))];
  const categories = [...new Set(dataset.map((d) => d.category))];

  const yearList = document.getElementById("yearDropdownList");
  yearList.innerHTML = "";
  const clearYear = document.createElement("li");
  clearYear.textContent = "---";
  clearYear.onclick = () => {
    filters.year = null;
    filters.month = null;
    setButtonLabel("yearDropdownBtn", "Year ▼");
    setButtonLabel("monthDropdownBtn", "Month ▼");

    document.getElementById("monthDropdownBtn").disabled = true;
    printBtn.disabled = true;

    document.getElementById("weekDropdownBtn").disabled = true;
    setButtonLabel("weekDropdownBtn", "Week ▼");

    printBtn.classList.add("disabled-print");
    helpText.style.display = "block";

    applyFilters();
  };

  yearList.appendChild(clearYear);

  years.forEach((y) => {
    const li = document.createElement("li");
    li.textContent = y;
    li.onclick = () => {
      filters.year = y;
      filters.month = null;
      setButtonLabel("yearDropdownBtn", `Year: ${y}`);
      setButtonLabel("monthDropdownBtn", "Month ▼");

      document.getElementById("monthDropdownBtn").disabled = false;
      printBtn.disabled = false;
      printBtn.classList.remove("disabled-print");
      helpText.style.display = "none";

      applyFilters();
    };
    yearList.appendChild(li);
  });

  const monthList = document.getElementById("monthDropdownList");
  monthList.innerHTML = "";
  const clearMonth = document.createElement("li");
  clearMonth.textContent = "---";
  clearMonth.onclick = () => {
    filters.month = null;
    setButtonLabel("monthDropdownBtn", "Month ▼");

    document.getElementById("weekDropdownBtn").disabled = true;
    setButtonLabel("weekDropdownBtn", "Week ▼");

    applyFilters();
  };
  monthList.appendChild(clearMonth);

  const monthNames = {
    "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June",
    "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December",
  };

  months.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = monthNames[m];

    li.onclick = () => {
      filters.month = m;
      filters.week = null;
      setButtonLabel("monthDropdownBtn", `Month: ${monthNames[m]}`);
      
      setButtonLabel("weekDropdownBtn", "Week ▼");
      document.getElementById("weekDropdownBtn").disabled = false;

      populateDropdowns();
      applyFilters();
    };
    monthList.appendChild(li);
  });

  const catList = document.getElementById("categoryDropdownList");
  catList.innerHTML = "";
  const clearCat = document.createElement("li");
  clearCat.textContent = "---";
  clearCat.onclick = () => {
    filters.category = null;
    setButtonLabel("categoryDropdownBtn", "Categories ▼");
    applyFilters();
  };
  catList.appendChild(clearCat);
  categories.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = c;
    li.onclick = () => {
      filters.category = c;
      setButtonLabel("categoryDropdownBtn", `Category: ${c}`);
      applyFilters();
    };
    catList.appendChild(li);
  });

  const weekList = document.getElementById("weekDropdownList");
weekList.innerHTML = "";
const clearWeek = document.createElement("li");
clearWeek.textContent = "---";
clearWeek.onclick = () => {
  filters.week = null;
  setButtonLabel("weekDropdownBtn", "Week ▼");
  applyFilters();
};
weekList.appendChild(clearWeek);

// Only populate if year + month are selected
if (filters.year && filters.month) {
  const filteredByMonth = dataset.filter((item) => {
    const [itemYear, itemMonth] = item.date.split("-");
    return itemYear === filters.year && itemMonth === filters.month;
  });

  const weeks = new Set();
  filteredByMonth.forEach((item) => {
    const week = getWeekOfMonth(item.date);
    weeks.add(week);
  });

  Array.from(weeks)
    .sort((a, b) => a - b)
    .forEach((weekNum) => {
      const li = document.createElement("li");
      li.textContent = `Week ${weekNum}`;
      li.onclick = () => {
        filters.week = weekNum;
        setButtonLabel("weekDropdownBtn", `Week: ${weekNum}`);
        applyFilters();
      };
      weekList.appendChild(li);
    });

}
}

function getWeekOfMonth(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = firstDay.getDay(); // 0 = Sunday
  const adjustedDate = day + dayOfWeek;
  return Math.ceil(adjustedDate / 7);
}

// Search input handler
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function () {
    filters.search = this.value;
    applyFilters();
  });

  // Reset search filter when clicking outside
  document.addEventListener("click", function (event) {
    if (event.target !== searchBox && !searchBox.contains(event.target)) {
      if (filters.search !== "") {
        filters.search = "";
        searchBox.value = "";
        applyFilters();
      }
    }
  });

  // Reset print button and month dropdown to disabled
  const printBtn = document.getElementById("printButton");
  const helpText = document.getElementById("printHelpText");
  const monthBtn = document.getElementById("monthDropdownBtn");
  const weekBtn = document.getElementById("weekDropdownBtn");


  monthBtn.disabled = true;
  weekBtn.disabled = true;
  printBtn.disabled = true;
  printBtn.classList.add("disabled-print");
  helpText.style.display = "block";

  renderTable(dataset);
});

function printSalesReport() {
  let filteredRows = document.querySelectorAll("#productGrid tr");

  if (filteredRows.length === 0) {
    alert("No data to print. Please adjust filters.");
    return;
  }

  const printArea = document.getElementById("printArea");
  filteredRows = document.querySelectorAll("#productGrid tr");
  const itemsSold = document.getElementById("ItemsSold").textContent;
  const revenue = document.getElementById("Revenue").textContent;
  const estimated = document.getElementById("EstimatedSales").textContent;
  const finalSales = document.getElementById("FinalSales").textContent;

  // Get filter labels from dropdown buttons
  const yearText = document
    .querySelector("button[onclick=\"toggleDropdown('yearDropdownList')\"]")
    .textContent.trim();

  const monthText = document
    .querySelector("button[onclick=\"toggleDropdown('monthDropdownList')\"]")
    .textContent.trim();

  const weekText = document
    .querySelector("button[onclick=\"toggleDropdown('weekDropdownList')\"]")
    .textContent.trim();

  const categoryText = document
    .querySelector("button[onclick=\"toggleDropdown('categoryDropdownList')\"]")
    .textContent.trim();

  // Determine filter descriptions to include in header
  const filtersUsed = [];
  if (yearText !== "Year ▼" && yearText !== "---" && yearText !== null)
    filtersUsed.push(yearText);
  if (monthText !== "Month ▼" && monthText !== "---" && monthText !== null)
    filtersUsed.push(monthText);
  if (weekText !== "Week ▼" && weekText !== "---" && weekText !== null)
    filtersUsed.push(weekText);
  if (
    categoryText !== "Categories ▼" && categoryText !== "---" && categoryText !== null
  )
    filtersUsed.push(categoryText);

  const filterHeadline =
    filtersUsed.length > 0
      ? `Filtered by: ${filtersUsed.join(", ")}`
      : "All Sales Records";

  // Build HTML report
  let html = `
    <h1 style="text-align: center; color: darkgreen;">    XYX Sales Report    </h1>
    <p style="text-align: right !important;">   Issued:    ${new Date().toLocaleDateString()}</p>
        <p style="text-align: center; font-weight: bold;">${filterHeadline}</p>
    <h3 style="color: darkgreen;">    Summary   </h3>
<p><strong>   Total Items Sold:   </strong> ${Number(
    itemsSold
  ).toLocaleString()}</p>
<p><strong>   Total Revenue:    </strong> ₱${parseFloat(
    revenue.replace(/,/g, "")
  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
<p><strong>   Estimated Discounted Sales Total:   </strong> ₱${parseFloat(
    estimated.replace(/,/g, "")
  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
<p><b>    Estimated Final Sales w/ 12% VAT:   </b> ₱${parseFloat(
    finalSales.replace(/,/g, "")
  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>

  `;
  html += `
    <table border="1" cellpadding="2" cellspacing="1" style="width: 100%; border-collapse: collapse;">
      <thead style="color: black !important; background-color: white !important;">
        <tr>
          <th style="color: black !important; background-color: white !important;">Date</th>
          <th style="color: black !important; background-color: white !important;">Product</th>
          <th style="color: black !important; background-color: white !important;">Quantity</th>
          <th style="color: black !important; background-color: white !important;">Price</th>
          <th style="color: black !important; background-color: white !important;">Total</th>
          <th style="color: black !important; background-color: white !important;">Category</th>
          <th style="color: black !important; background-color: white !important; font-size: 8pt !important;">Compatibility</th>
          <th style="color: black !important; background-color: white !important;">Discount</th>
           <th style="color: black !important; background-color: white !important;">Color</th>
          <th style="color: black !important; background-color: white !important;">Addon</th>
        </tr>
      </thead>
      <tbody>
  `;

  filteredRows.forEach((row) => {
    html += `<tr>${row.innerHTML}</tr>`;
  });

  // Inject into print area
  printArea.innerHTML = html;
  printArea.style.display = "block";

  // Trigger print
  window.print();

  setTimeout(() => {
    printArea.style.display = "none";
  }, 500);
}
