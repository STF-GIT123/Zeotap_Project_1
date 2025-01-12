document.addEventListener("DOMContentLoaded", () => {
    const spreadsheet = document.getElementById("spreadsheet");
    for (let i = 0; i < 100; i++) { // Create 100 cells
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.contentEditable = true; // Allow users to type directly
      cell.addEventListener("click", () => selectCell(cell));
      spreadsheet.appendChild(cell);
    }
  });
  
  let selectedCell = null;
  
  function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove("selected");
    selectedCell = cell;
    selectedCell.classList.add("selected");
  }


  function parseRange(range) {
    const cells = document.querySelectorAll(".cell");
    const [start, end] = range.split(":");
  
    const startIndex = convertCellToIndex(start.trim());
    const endIndex = convertCellToIndex(end.trim());
  
    return Array.from(cells).slice(startIndex, endIndex + 1);
  }
  
  function convertCellToIndex(cell) {
    const column = cell.charCodeAt(0) - "A".charCodeAt(0); // Convert letter to number
    const row = parseInt(cell.substring(1)) - 1; // Convert number part (1-based) to 0-based
    return row * 10 + column; // Assuming 10 columns
  }
  
  function evaluateFormula(formula) {
    if (formula.startsWith("=")) {
      const [func, range] = formula.substring(1).split("(");
      const cells = parseRange(range.replace(")", "").trim());
      const values = cells.map(cell => parseFloat(cell.textContent) || 0);
  
      switch (func.trim().toUpperCase()) {
        case "SUM":
          return values.reduce((a, b) => a + b, 0);
        case "AVERAGE":
          return values.reduce((a, b) => a + b, 0) / values.length;
        case "MAX":
          return Math.max(...values);
        case "MIN":
          return Math.min(...values);
        case "COUNT":
          return values.length;
          case "MEDIAN":
            values.sort((a, b) => a - b);
            const mid = Math.floor(values.length / 2);
            return values.length % 2 === 0
              ? (values[mid - 1] + values[mid]) / 2
              : values[mid];
          case "MODE":
            const frequency = {};
            values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
            return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
          case "POWER":
            return Math.pow(values[0], values[1]);  
        default:
          return "Invalid Function!";
      }
    }
    return formula;
  }


  function applyTrim() {
    if (selectedCell) {
      selectedCell.textContent = selectedCell.textContent.trim();
    }
  }
  
  function applyUpper() {
    if (selectedCell) {
      selectedCell.textContent = selectedCell.textContent.toUpperCase();
    }
  }
  
  function applyLower() {
    if (selectedCell) {
      selectedCell.textContent = selectedCell.textContent.toLowerCase();
    }
  }
  
  function removeDuplicates() {
    const rows = {};
    const cells = document.querySelectorAll(".cell");
    
    cells.forEach((cell, index) => {
      const rowIndex = Math.floor(index / 10); // Assuming 10 columns
      const value = cell.textContent.trim();
      
      if (!rows[rowIndex]) rows[rowIndex] = new Set();
  
      if (rows[rowIndex].has(value)) {
        cell.textContent = ""; // Clear duplicate
      } else {
        rows[rowIndex].add(value);
      }
    });
  }
  
  function findAndReplace(findText, replaceText) {
    const cells = document.querySelectorAll(".cell");
  
    cells.forEach(cell => {
      if (cell.textContent.includes(findText)) {
        cell.textContent = cell.textContent.replace(new RegExp(findText, "g"), replaceText);
      }
    });
  }


let isDragging = false;
let startCell = null;
let endCell = null;

// Handle cell drag start
document.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("cell")) {
    isDragging = true;
    startCell = event.target;
  }
});

// Handle cell drag over
document.addEventListener("mousemove", (event) => {
  if (isDragging && event.target.classList.contains("cell")) {
    endCell = event.target;
    highlightSelection(startCell, endCell);
  }
});

// Handle cell drag end
document.addEventListener("mouseup", () => {
  if (isDragging && startCell && endCell) {
    copyContent(startCell, endCell);
  }
  isDragging = false;
  startCell = null;
  endCell = null;
  clearSelectionHighlight();
});

// Highlight selected cells during drag
function highlightSelection(start, end) {
  const cells = document.querySelectorAll(".cell");
  const startIndex = Array.from(cells).indexOf(start);
  const endIndex = Array.from(cells).indexOf(end);

  cells.forEach((cell, index) => {
    cell.classList.remove("drag-selected");
    if (index >= Math.min(startIndex, endIndex) && index <= Math.max(startIndex, endIndex)) {
      cell.classList.add("drag-selected");
    }
  });
}

// Copy content or formula to selected range
function copyContent(start, end) {
  const cells = document.querySelectorAll(".cell");
  const startIndex = Array.from(cells).indexOf(start);
  const endIndex = Array.from(cells).indexOf(end);

  const contentToCopy = start.textContent;
  for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
    cells[i].textContent = contentToCopy;
  }
}

// Clear selection highlights after drag
function clearSelectionHighlight() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.classList.remove("drag-selected"));
}


const cellDependencies = {};

// Track cell dependencies when a formula is added
function trackDependencies(cell, formula) {
  const dependentCells = formula.match(/[A-Z]\d+/g); // Extract referenced cells like A1, B2, etc.
  if (dependentCells) {
    dependentCells.forEach(dep => {
      if (!cellDependencies[dep]) {
        cellDependencies[dep] = [];
      }
      if (!cellDependencies[dep].includes(cell)) {
        cellDependencies[dep].push(cell);
      }
    });
  }
}

// Update dependent cells when a related cell changes
function updateDependencies(changedCell) {
  const dependents = cellDependencies[changedCell];
  if (dependents) {
    dependents.forEach(cell => {
      const formula = cell.dataset.formula;
      const result = evaluateFormula(formula);
      cell.textContent = isNaN(result) ? result : result.toFixed(2);
    });
  }
}

// Listen for cell content changes
document.addEventListener("input", (event) => {
  if (event.target.classList.contains("cell")) {
    const cellId = getCellId(event.target);
    updateDependencies(cellId);
  }
});

// Get unique cell ID (e.g., A1, B2)
function getCellId(cell) {
  const index = Array.from(document.querySelectorAll(".cell")).indexOf(cell);
  const column = String.fromCharCode(65 + (index % 10)); // Convert to letter (A-J)
  const row = Math.floor(index / 10) + 1;
  return `${column}${row}`;
}


function applyBold() {
    if (selectedCell) {
      selectedCell.style.fontWeight = selectedCell.style.fontWeight === "bold" ? "normal" : "bold";
    }
  }
  
  function applyItalic() {
    if (selectedCell) {
      selectedCell.style.fontStyle = selectedCell.style.fontStyle === "italic" ? "normal" : "italic";
    }
  }
  
  function applyFontSize(size) {
    if (selectedCell) {
      selectedCell.style.fontSize = `${size}px`;
    }
  }
  
  function applyColor(color) {
    if (selectedCell) {
      selectedCell.style.color = color;
    }
  }


  function addRow() {
    const spreadsheet = document.getElementById("spreadsheet");
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.contentEditable = true;
      cell.addEventListener("click", () => selectCell(cell));
      spreadsheet.appendChild(cell);
    }
  }
  
  function addColumn() {
    const spreadsheet = document.getElementById("spreadsheet");
    spreadsheet.style.gridTemplateColumns = `repeat(${spreadsheet.style.gridTemplateColumns.split(" ").length + 1}, 100px)`;
    const rows = spreadsheet.children.length / (spreadsheet.style.gridTemplateColumns.split(" ").length - 1);
    for (let i = 0; i < rows; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.contentEditable = true;
      cell.addEventListener("click", () => selectCell(cell));
      spreadsheet.appendChild(cell);
    }
  }


  function resizeColumns() {
    const newSize = prompt("Enter column width (e.g., 100px):");
    if (newSize) {
      document.getElementById("spreadsheet").style.gridTemplateColumns = `repeat(10, ${newSize})`;
    }
  }


  function parseRange(range) {
    const cells = document.querySelectorAll(".cell");
    const [start, end] = range.split(":");
  
    const startIndex = convertCellToIndex(start.trim());
    const endIndex = end ? convertCellToIndex(end.trim()) : startIndex;
  
    return Array.from(cells).slice(startIndex, endIndex + 1);
  }
  
  function convertCellToIndex(cellReference) {
    const match = cellReference.match(/([A-Z]+)(\d+)/);
    if (!match) return -1;
  
    const column = match[1].charCodeAt(0) - "A".charCodeAt(0); // Column (A=0, B=1...)
    const row = parseInt(match[2]) - 1; // Row (1-based to 0-based)
    return row * 10 + column; // Assuming a 10-column grid
  }


  function saveData() {
    const cells = document.querySelectorAll(".cell");
    const data = Array.from(cells).map(cell => ({
      content: cell.textContent,
      style: {
        fontWeight: cell.style.fontWeight || "normal",
        fontStyle: cell.style.fontStyle || "normal",
        color: cell.style.color || "#000",
        fontSize: cell.style.fontSize || "16px"
      },
      formula: cell.dataset.formula || ""
    }));
    localStorage.setItem("spreadsheet", JSON.stringify(data));
    alert("Spreadsheet saved!");
  }
  
  function loadData() {
    const data = JSON.parse(localStorage.getItem("spreadsheet"));
    if (!data) return alert("No saved spreadsheet found!");
    const cells = document.querySelectorAll(".cell");
  
    data.forEach((cellData, index) => {
      const cell = cells[index];
      cell.textContent = cellData.content;
      cell.style.fontWeight = cellData.style.fontWeight;
      cell.style.fontStyle = cellData.style.fontStyle;
      cell.style.color = cellData.style.color;
      cell.style.fontSize = cellData.style.fontSize;
      cell.dataset.formula = cellData.formula;
    });
    alert("Spreadsheet loaded!");
  }


  function generateChart() {
    const labels = []; // Column headers or custom labels
    const data = []; // Numerical data from selected cells
  
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      if (!isNaN(cell.textContent) && cell.textContent.trim() !== "") {
        labels.push(cell.dataset.label || `Cell ${cell.textContent}`);
        data.push(parseFloat(cell.textContent));
      }
    });
  
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Change to 'line', 'pie', etc. as needed
      data: {
        labels: labels,
        datasets: [{
          label: "Spreadsheet Data",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }


  