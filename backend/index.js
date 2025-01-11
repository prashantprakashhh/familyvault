// // backend/index.js

// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const path = require("path");
// const dotenv = require("dotenv");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const mysql = require("mysql2/promise");

// dotenv.config();
// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({
//   origin: "http://localhost:3000", // Adjust based on your frontend URL
//   credentials: true,
// }));

// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Initialize MySQL connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "family_vault",
// });

// // JWT Authentication Middleware
// const auth = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader) {
//     return res.status(401).json({ message: "No token, authorization denied." });
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token is not valid." });
//   }
// };

// // Multer Configuration for File Uploads (storing files locally)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Ensure this directory exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage: storage });

// // Routes

// // Root Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Family Photo Vault Backend!");
// });

// // Test Endpoint
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is working!" });
// });

// // User Registration
// app.post("/api/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     // Check if user already exists
//     const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert user into database
//     await db.query(
//       "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())",
//       [username, email, hashedPassword]
//     );

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Registration failed.", error });
//   }
// });

// // User Login
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     // Fetch user from database
//     const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     if (users.length === 0) {
//       return res.status(400).json({ message: "Invalid credentials." });
//     }

//     const user = users[0];

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials." });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

//     res.json({ message: "Login successful!", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed.", error });
//   }
// });

// // Protected Route Example
// app.get("/api/protected", auth, (req, res) => {
//   res.json({ message: `Hello User ${req.user.id}, you have accessed a protected route!` });
// });

// // File Upload Endpoint
// app.post("/api/upload", auth, upload.single("photo"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded." });
//   }

//   try {
//     // Example: Save file info to database
//     const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
//     await db.query(
//       "INSERT INTO photos (user_id, filename, url, uploaded_at) VALUES (?, ?, ?, NOW())",
//       [req.user.id, req.file.filename, fileUrl]
//     );

//     res.status(200).json({
//       message: "File uploaded successfully!",
//       url: fileUrl,
//       filename: req.file.filename
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "File upload failed.", error });
//   }
// });

// // Storage Cost Analysis Endpoint (Dummy Implementation)
// app.get("/api/storage-cost", auth, async (req, res) => {
//   try {
//     // Dummy data for storage cost
//     const sizeInGB = 2.5; // Replace with actual calculation
//     const estimatedCost = (sizeInGB * 0.026).toFixed(2); // Example calculation

//     res.json({ sizeInGB: sizeInGB.toFixed(2), estimatedCost: `$${estimatedCost}` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch storage cost.", error });
//   }
// });

// // Serve Frontend in Production (Optional)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
//   });
// }

// // Start Server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));

// backend/index.js

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { sequelize, User, Photo } = require("./models"); // Import initialized models

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

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync Models with Database
sequelize.sync()
  .then(() => console.log('Database & tables synced!'))
  .catch(err => console.error('Error syncing database:', err));

// JWT Authentication Middleware
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  const token = authHeader.split(" ")[1];
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

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Family Photo Vault Backend!");
});

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
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ 
      message: "User registered successfully!", 
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed.", error: error.message });
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

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
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

// Protected Route Example
app.get("/api/protected", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at'],
      include: [{
        model: Photo,
        as: 'photos',
        attributes: ['id', 'filename', 'url', 'uploaded_at']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ 
      message: `Hello ${user.username}, you have accessed a protected route!`, 
      user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to access protected route.", error: error.message });
  }
});

// File Upload Endpoint
app.post("/api/upload", auth, upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Save file info to database
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    const photo = await Photo.create({
      userId: req.user.id,
      filename: req.file.filename,
      url: fileUrl,
    });

    res.status(200).json({
      message: "File uploaded successfully!",
      photo: {
        id: photo.id,
        user_id: photo.userId,
        filename: photo.filename,
        url: photo.url,
        uploaded_at: photo.uploaded_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed.", error: error.message });
  }
});

// NEW: List All Users (Public)
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// Get one user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [{
        model: Photo,
        as: 'photos'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Find existing user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    res.json({ message: "User updated successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
// Get all photos for a specific user by user ID
app.get('/users/:id/photos', async (req, res) => {
  try {
    const userId = req.params.id;
    const photos = await Photo.findAll({ where: { userId } });
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Delete a user by ID
// app.delete('/users/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     await user.destroy();
//     res.json({ message: `User with ID ${userId} deleted successfully!` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// });


// Storage Cost Analysis Endpoint (Dummy Implementation)
app.get("/api/storage-cost", auth, async (req, res) => {
  try {
    const photos = await Photo.findAll({ where: { userId: req.user.id } });
    let totalSizeBytes = 0;

    photos.forEach(photo => {
      totalSizeBytes += (photo.filename.length + photo.url.length);
    });

    const sizeInGB = totalSizeBytes / (1024 ** 3);
    const costPerGB = 0.026; // Example rate
    const estimatedCost = (sizeInGB * costPerGB).toFixed(2);

    res.json({ sizeInGB: sizeInGB.toFixed(2), estimatedCost: `$${estimatedCost}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch storage cost.", error: error.message });
  }
});

// Serve Frontend in Production (Optional)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
