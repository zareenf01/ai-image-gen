import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.API_KEY;

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello from backend server!");
});

app.post("/generate-content", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (!API_KEY) {
    console.error("API_KEY is missing in env");
    res
      .status(500)
      .json({ error: "Internal Server Error: API_KEY not configured" });
    return;
  }

  try {
    const response = await axios.post(
      "https://api.imagepig.com/",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": API_KEY,
        },
      }
    );

    console.log("API Response:", response.data);

    if (response.status !== 200) {
      console.error("API Error:", response.data);
      res.status(response.status).json({
        error: `Error from image API: ${response.statusText}`,
      });
      return;
    }

    const imageData = response.data.image_data;
    const savedImg = await prisma.image.create({
      data: {
        prompt,
        imageData,
      },
    });
    res.status(200).json({
      message: "Image generated successfully",
      image_data: imageData,
    });

    const data = response.data;

    if (!data.image_data) {
      res.status(500).json({
        error: "No image data received from API",
        apiResponse: data,
      });
      return;
    }
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message || error);
    res.status(500).json({
      error: "Failed to generate image",
      status: error.response?.status || "unknown",
      message: error.message || "No error message available",
      details: error.response?.data || "No detailed error information",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
