# Zeotap_Project_1

# *Spreadsheet Web Application - Google Sheets Mimic*  

## *Objective*  
The objective of this project is to develop a web application that mimics the user interface and core functionalities of Google Sheets. It focuses on mathematical and data quality functions, data entry, drag-and-drop interactions, and key UI features while also implementing advanced features such as saving/loading spreadsheets and data visualization.  

---

## *Features*  

### *Core Features*  
1. *Spreadsheet Interface*:  
   - A user interface resembling Google Sheets with grid-based cells, toolbar, and formula bar.  
   - Drag-and-drop functionality for copying content, formulas, and cell selections.  
   - Support for adding, deleting, and resizing rows and columns.  

2. *Mathematical Functions*:  
   - Supported functions: SUM, AVERAGE, MAX, MIN, COUNT, MEDIAN, MODE, POWER.  
   - Ability to process formulas using cell references (e.g., =SUM(A1:A10)).  

3. *Data Quality Functions*:  
   - TRIM: Removes extra spaces.  
   - UPPER: Converts text to uppercase.  
   - LOWER: Converts text to lowercase.  
   - REMOVE_DUPLICATES: Removes duplicate rows.  
   - FIND_AND_REPLACE: Finds and replaces specific text.  

4. *Data Entry and Validation*:  
   - Supports text, numbers, and dates.  
   - Validation ensures numeric cells only accept valid numbers.  

5. *Save and Load*:  
   - Save the spreadsheet data to the browser's localStorage.  
   - Reload previously saved spreadsheets.  

6. *Data Visualization*:  
   - Generate charts (bar, line, pie, etc.) using Chart.js.  

---

## *Bonus Features*  
1. Absolute and relative referencing for formulas (e.g., $A$1, A1).  
2. Advanced formula evaluation for complex operations.  
3. Rich cell formatting: Bold, italics, font size, and color options.  

---

## *Tech Stack Used*  

### *Frontend*  
1. *HTML*:  
   - Provides the basic structure for the grid, toolbar, and other UI elements.  
   - Ensures a clean and semantic layout.  

2. *CSS*:  
   - Used to style the spreadsheet grid and toolbar.  
   - Flexbox and grid layout for responsiveness.  

3. *JavaScript*:  
   - Core logic for cell interactions, formula evaluation, drag-and-drop functionality, and UI updates.  
   - Manages cell dependencies and event-driven updates for dynamic behavior.  

4. *Chart.js*:  
   - A lightweight library for creating interactive charts.  
   - Chosen for its simplicity, flexibility, and excellent documentation.  

### *Data Storage*  
1. *localStorage*:  
   - Used for saving and reloading spreadsheet data.  
   - Simple, fast, and browser-compatible.  
   - Does not require server-side handling, keeping the application lightweight.  

---

## *Data Structures Used*  

### *1. Two-Dimensional Array*  
- *Purpose*: To represent the spreadsheet grid.  
- *Usage*:  
  - Cells are accessed by their row and column indices (e.g., A1 -> array[0][0]).  
  - Enables efficient updates and formula parsing.  

### *2. Object for Cell Dependencies*  
- *Purpose*: To track dependent cells for automatic updates when a referenced cell changes.  
- *Structure*:  
  json
  {
    "A1": ["B1", "C1"],
    "B2": ["C2"]
  }
    
- *Usage*: When a cell value changes, all dependent cells are updated recursively.  

### *3. JSON for Saving Data*  
- *Purpose*: Store spreadsheet content, formatting, and formulas.  
- *Structure*:  
  json
  [
    {
      "content": "100",
      "style": {
        "fontWeight": "bold",
        "fontStyle": "italic",
        "color": "#000000",
        "fontSize": "16px"
      },
      "formula": "=SUM(A1:A3)"
    }
  ]
    

### *4. Regular Expressions*  
- *Purpose*: Parse formulas and extract cell references.  
- *Usage*:  
  - Identify valid formulas (e.g., starting with =).  
  - Extract ranges like A1:A10.  

---

## *How It Works*  

### *Grid Layout*  
- The spreadsheet grid is created using a CSS grid layout with dynamically adjustable rows and columns.  

### *Formula Evaluation*  
- Formulas are evaluated by parsing cell references and applying mathematical operations.  
- Dependencies are tracked to ensure updates propagate correctly.  

### *Drag-and-Drop*  
- Uses mouse event listeners (mousedown, mousemove, mouseup) to enable drag-and-drop selection and copying.  

### *Data Persistence*  
- Data is saved to localStorage in JSON format.  
- Upon reloading, data is retrieved and applied to the grid.  

### *Visualization*  
- Chart.js is used to generate interactive charts based on selected cell data.  

---

## *Why This Tech Stack and Data Structures?*  

1. *HTML, CSS, JavaScript*:  
   - Lightweight, universally supported technologies for building web applications.  
   - No need for server-side processing simplifies the deployment process.  

2. *localStorage*:  
   - Avoids the complexity of a database while ensuring data persistence.  
   - Works offline, making the application accessible without an internet connection.  

3. *Chart.js*:  
   - Simplifies chart creation with minimal configuration.  
   - Integrates seamlessly with JavaScript for dynamic updates.  

4. *Two-Dimensional Array*:  
   - Intuitive representation of the spreadsheet grid.  
   - Enables quick access and updates for cell operations.  

5. *JSON*:  
   - Human-readable format for storing and retrieving data.  
   - Easy to manipulate and compatible with JavaScript.  

---

## *Setup and Installation*  

1. Clone the repository:  
   bash
   git clone 
   cd spreadsheet-mimic
     

2. Open index.html in your browser:  
   - No additional setup required.  

3. Optional: Serve the application locally using a static file server:  
   bash
   npx http-server .
   
---

## *Future Improvements*  

1. Full support for absolute references ($A$1).  
2. Collaboration features with real-time updates (e.g., WebSockets).  
3. Integration with cloud storage for saving/loading spreadsheets.  
4. More advanced formula support (e.g., nested formulas, matrix operations).  

---

## *Credits*  
- Developed by Shaik Tahira Farheen.  
