const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const SellRequest = require("../models/SellRequest");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


router.post("/pets", upload.single("image"), async (req, res) => {
  try {
    const { name, type, price, gender, foodHabit, description } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ message: "Name, Type, and Price are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const pet = new Pet({ name, type, price, gender, foodHabit, description, image: imagePath });
    await pet.save();

    res.status(201).json({ message: "Pet added successfully", pet });
  } catch (err) {
    console.error("Error adding pet:", err);
    res.status(500).json({ message: "Error adding pet", error: err.message });
  }
});

router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pets" });
  }
});

router.delete("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting pet" });
  }
});


router.get("/adoptions", async (req, res) => {
  try {
    const requests = await AdoptionRequest.find();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching adoption requests" });
  }
});


router.get("/sell-requests", async (req, res) => {
  try {
    const requests = await SellRequest.find();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching sell requests" });
  }
});

module.exports = router;
