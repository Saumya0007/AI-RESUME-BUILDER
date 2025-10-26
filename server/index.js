import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Allow multiple origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-resume-builder-2-lpf3.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow anyway for now (change to false in production)
    }
  },
  credentials: true 
}));

app.use(express.json());

// Helper to open a file-backed SQLite DB located next to this file.
async function openDb() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbPath = path.join(__dirname, 'database.db');

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Ensure DB and table exist
(async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log("✅ SQLite database ready at", path.join(process.cwd(), 'server', 'database.db'));
  await db.close();
})();

// Signup route
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const db = await openDb();
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) {
      await db.close();
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed]);
    await db.close();
    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    await db.close();
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful", name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Resume generator using Pollinations (free)
app.post("/generate-resume", async (req, res) => {
  const { userData } = req.body;
  if (!userData) return res.status(400).json({ error: "Missing user data" });

  try {
    console.log("Generating resume for:", userData.substring(0, 100));
    
    const response = await axios.post(
      "https://text.pollinations.ai/openai",
      {
        model: "mistral",
        messages: [
          { role: "system", content: "You are a professional resume builder AI." },
          {
            role: "user",
            content: `Create a clean, ATS-friendly professional resume using this data:\n\n${userData}`,
          },
        ],
      },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    const resumeText =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.output ||
      response.data?.text ||
      JSON.stringify(response.data);

    console.log("Resume generated successfully");
    res.json({ resume: resumeText });
  } catch (error) {
    console.error("Pollinations AI error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error || "AI resume generation failed",
      details: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server running with Pollinations + SQLite + Resume Generator");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));