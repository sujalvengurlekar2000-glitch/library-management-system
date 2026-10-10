require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const authroutes = require("./routes/authroutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authroutes);
app.use("/api/books",authMiddleware, bookRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

app.get("/", (req, res) => {
  res.send("✅ Hello from Library API");
});
