const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const dataRoutes = require("./routes/dataRoutes"); // Correctly using routes

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/time-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/data", dataRoutes); // ✅ Route handling properly

// Start the Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
