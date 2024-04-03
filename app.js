const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON request body
app.use(express.json());

// Route to handle adding tires to inventory


app.post("/api/add-tires", (req, res) => {
  // Read request body to get tire data
  const { brand, quantity, size } = req.body;

  // Read current inventory data from JSON file
  const inventoryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "inventory.json"), "utf8")
  );

  // Check if the tire already exists in inventory
  const existingTireIndex = inventoryData.findIndex(
    (tire) => tire.brand === brand && tire.size === size
  );

  if (existingTireIndex !== -1) {
    // If tire exists, update quantity
    inventoryData[existingTireIndex].quantity += quantity;
  } else {
    // If tire doesn't exist, add it to inventory
    inventoryData.push({ brand, quantity, size });
  }

  // Update inventory JSON file
  fs.writeFileSync(
    path.join(__dirname, "inventory.json"),
    JSON.stringify(inventoryData, null, 2)
  );

  res.send("Tires added successfully.");
});

// Route to handle selling tires
// Route to handle selling tires

// Serve static files from the public directory

// Route to handle selling tires

app.post("/api/sell-tires", (req, res) => {
  // Read request body to get sold tire data

  const { brand, quantity, size } = req.body;

  // Read current inventory data from JSON file
  const inventoryData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "inventory.json"), "utf8")
  );

  // Find the tire in inventory
  const tireIndex = inventoryData.findIndex(
    (tire) => tire.brand === brand && tire.size === size
  );

  if (tireIndex !== -1) {
    // Check if enough quantity is available to sell
    if (inventoryData[tireIndex].quantity >= quantity) {
      // Reduce the quantity of tires
      inventoryData[tireIndex].quantity -= quantity;

      // If quantity becomes 0, remove tire from inventory
      if (inventoryData[tireIndex].quantity === 0) {
        inventoryData.splice(tireIndex, 1);
      }

      // Update inventory JSON file
      fs.writeFileSync(
        path.join(__dirname, "inventory.json"),
        JSON.stringify(inventoryData, null, 2)
      );

      // Record sold tires
      const soldTiresData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "sold-tires.json"), "utf8")
      );
      soldTiresData.push({ brand, quantity, size });
      fs.writeFileSync(
        path.join(__dirname, "sold-tires.json"),
        JSON.stringify(soldTiresData, null, 2)
      );

      res.send("Tires sold successfully.");
    } else {
      res.status(400).send("Insufficient quantity in inventory.");
    }
  } else {
    res.status(404).send("Tire not found in inventory.");
  }
});

// Route to get current inventory data
app.get("/api/inventory", (req, res) => {
  // Read inventory JSON file and send its contents as response
  const inventoryData = fs.readFileSync(
    path.join(__dirname, "inventory.json"),
    "utf8"
  );
  res.json(JSON.parse(inventoryData));
});

// Route to get sold tires data
app.get("/api/sold-tires", (req, res) => {
  // Read sold tires JSON file and send its contents as response
  const soldTiresData = fs.readFileSync(
    path.join(__dirname, "sold-tires.json"),
    "utf8"
  );
  res.json(JSON.parse(soldTiresData));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
