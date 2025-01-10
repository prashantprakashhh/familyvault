// backend/index.js

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require("mysql2/promise");

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", // Adjust based on your frontend URL
  credentials: true,
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "family_vault",
});

// JWT Authentication Middleware
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

// Multer Configuration for File Uploads (storing files locally)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes

// Test Endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// User Registration
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    await db.query(
      "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed.", error });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Fetch user from database
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed.", error });
  }
});

// Protected Route Example
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: `Hello User ${req.user.id}, you have accessed a protected route!` });
});

// File Upload Endpoint
app.post("/api/upload", auth, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Example: Save file info to database
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    await db.query(
      "INSERT INTO photos (user_id, filename, url, uploaded_at) VALUES (?, ?, ?, NOW())",
      [req.user.id, req.file.filename, fileUrl]
    );

    res.status(200).json({
      message: "File uploaded successfully!",
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed.", error });
  }
});

// Serve Frontend in Production (Optional)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
