const fs = require("fs");
const csv = require("csv-parser");

// Function to process CSV and count records by mod N
function processCSV(filePath, idColumn, modValue) {
    const groups = {};

    // Initialize counters dynamically
    for (let i = 0; i < modValue; i++) {
        groups[i] = 0;
    }

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            const id = parseInt(row[idColumn]); // Extract ID
            if (!isNaN(id)) {
                const modResult = id % modValue;
                groups[modResult]++;  // Increment counter
            }
        })
        .on("end", () => {
            console.log("✅ CSV Processing Complete!");
            console.log("🔹 Count by Mod Groups:", JSON.stringify(groups, null, 2));
        });
}

// Example Usage
processCSV("orders.csv", "_id", 4);  // Replace "mongoId" with your actual column name
