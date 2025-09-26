require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Middleware Imports
const errorHandler = require('./middleware/errorMiddleware');

// Route Imports
const userRoutes = require("./routes/userRoutes");

// Documentation
const swaggerDocs = require('./docs/swagger');

const app = express();

// Swagger Documentation
swaggerDocs(app);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://frontend:3000'] 
    : ['http://frontend:3000'],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Backend läuft erfolgreich",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use("/api/users", userRoutes);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route nicht gefunden",
    path: req.originalUrl 
  });
});

// Error Handler (muss als letztes kommen)
app.use(errorHandler);

module.exports = app;