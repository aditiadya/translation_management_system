import express from "express";
import db from "../models/index.js";

const { Language } = db;

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const languages = await Language.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    res.status(200).json(languages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch languages" });
  }
});

export default router;
