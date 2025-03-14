const express = require("express");
const router = express.Router();
const TimeTracking = require("../models/Website");
const Website = require("../models/Website");

// ✅ POST: Save Time Tracking Data
router.post("/save", async (req, res) => {
    try {
        console.log("Incoming request:", req.body);
        const { url, timeSpent, userId } = req.body;

        if (!url || !timeSpent || !userId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newEntry = new TimeTracking({ url, timeSpent, userId });
        await newEntry.save();

        res.status(201).json({ message: "✅ Data saved successfully", newEntry });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ GET: Fetch Time Tracking Data
router.get("/", async (req, res) => {
    try {
        const data = await Website.find(); // Fetch all time tracking data
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

// ✅ GET: Simple Response for `/save`
router.get("/save", (req, res) => {
    res.json({ message: "This is the save endpoint. Use POST to send data." });
});

module.exports = router;
