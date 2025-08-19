import express from "express";
import db from "../models/index.js";

const { Currency } = db; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const currencies = await Currency.findAll({
      attributes: ["id", "code", "name", "symbol"], // adjust fields as per your model
      order: [["name", "ASC"]],
    });
    res.status(200).json(currencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch currencies" });
  }
});

export default router;
