const express = require("express");
const cors = require("cors");
require('dotenv').config();

require("./db");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Government Welfare Queue Backend Running");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const officerRoutes = require("./routes/officer.routes");

app.use("/api/officer", officerRoutes);