const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config(); 

const app = express();


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(errorHandler);


app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
