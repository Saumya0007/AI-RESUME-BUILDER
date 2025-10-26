import bcrypt from "bcryptjs";
import { openDb } from "../database.js";

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const db = await openDb();
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword
    ]);
    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error signing up" });
  }
};

export const loginUser = async (req, res) => {
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
};
