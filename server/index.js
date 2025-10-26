import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ✅ Initialize SQLite
async function openDb() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

// ✅ Setup database if not exists
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
  console.log("✅ SQLite database ready!");
})();

// ✅ Signup route
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const db = await openDb();
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed]);
    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// ✅ Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful", name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Resume generator using Pollinations (free)
app.post("/generate-resume", async (req, res) => {
  const { userData } = req.body;
  if (!userData) return res.status(400).json({ error: "Missing user data" });

  try {
    const response = await axios.post(
      "https://text.pollinations.ai/openai",
      {
        model: "mistral", // ✅ free model
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

    res.json({ resume: resumeText });
  } catch (error) {
    console.error("Pollinations AI error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error || "AI resume generation failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server running with Pollinations + SQLite + Resume Generator");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

