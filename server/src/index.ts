import express from "express";
import cors from "cors";
import { Prisma, PrismaClient } from "@prisma/client";
import axios from "axios";
import sharp from "sharp";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const GALLERY_PAGE_SIZE = 18;
const BLOCKED_WORDS = [
  "jizz",
  "shit",
  "fuck",
  "porn",
  "nude",
  "naked",
  "sex",
  "joint",
  "weed",
  "bitch",
  "dick",
  "cock",
  "pussy",
  "boob",
  "nsfw",
];

async function shrinkImage(base64: string) {
  try {
    const output = await sharp(Buffer.from(base64, "base64"))
      .resize(768, 768, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    return output.toString("base64");
  } catch (error) {
    console.error("Failed to compress image:", error);
    return base64;
  }
}

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello from backend server!");
});

app.post("/generate-content", async (req, res) => {
  const prompt =
    typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    console.error("CF_ACCOUNT_ID or CF_API_TOKEN is missing in env");
    res
      .status(500)
      .json({ error: "Internal Server Error: image API not configured" });
    return;
  }

  let imageData: string | undefined;
  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
      { prompt: prompt.slice(0, 2048), steps: 4 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CF_API_TOKEN}`,
        },
        timeout: 60000,
      }
    );
    imageData = response.data?.result?.image;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const details = axios.isAxiosError(error)
      ? error.response?.data?.errors ?? error.code
      : undefined;
    console.error("Image API error:", status, details ?? error);
    res.status(502).json({
      error: "Failed to generate image",
      status: status ?? "no response",
      details: details ?? "The image API did not respond",
    });
    return;
  }

  if (!imageData) {
    res.status(502).json({ error: "No image data received from image API" });
    return;
  }

  try {
    await prisma.image.create({
      data: { prompt, imageData: await shrinkImage(imageData) },
    });
  } catch (error) {
    console.error("Failed to save image to database:", error);
  }

  res.status(200).json({
    message: "Image generated successfully",
    image_data: imageData,
  });
});

app.get("/images", async (req, res) => {
  try {
    const images = await prisma.image.findMany();
    res.status(200).json(images);
  } catch (error) {
    res.json({ error: "Failed to fetch images" });
  }
});

app.get("/gallery", async (req, res) => {
  const limit = Math.min(
    Math.max(parseInt(String(req.query.limit ?? GALLERY_PAGE_SIZE), 10) || GALLERY_PAGE_SIZE, 1),
    50
  );
  const cursor =
    typeof req.query.cursor === "string" && /^[a-f0-9]{24}$/.test(req.query.cursor)
      ? req.query.cursor
      : undefined;
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";

  const where: Prisma.ImageWhereInput = {
    AND: [
      ...(q ? [{ prompt: { contains: q, mode: Prisma.QueryMode.insensitive } }] : []),
      ...BLOCKED_WORDS.map((word) => ({
        NOT: { prompt: { contains: word, mode: Prisma.QueryMode.insensitive } },
      })),
    ],
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.image.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      prisma.image.count({ where }),
    ]);
    const hasMore = rows.length > limit;
    const images = hasMore ? rows.slice(0, limit) : rows;
    res.status(200).json({
      images,
      total,
      nextCursor: hasMore ? images[images.length - 1].id : null,
    });
  } catch (error) {
    console.error("Failed to fetch gallery page:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
