import express, { json } from 'express';
import cors from 'cors';
import connectDB from './src/config/Db.js';
import seatRoutes from "./src/routes/SeatBooking.js"
import Seat from "./src/models/SeatBookingSchema.js" ;

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
connectDB();




const app = express();

// Middleware
app.use(cors());
app.use(json());

// Test Route
app.get("/health", (req, res) => {
  res.send({ message: "health ok!" });
});

// Middleware for routes
app.use('/api/seats', seatRoutes); // Prefix for all seat routes

// Example: Route will be `/api/seats/getseats`

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
