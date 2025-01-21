const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Error Handler Middleware
app.use(errorHandler);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log('Backend is running on http://localhost:5000');
});
