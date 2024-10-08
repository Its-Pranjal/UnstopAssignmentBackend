import express, { json } from "express";
import mongoose from 'mongoose';
import Seat from "../models/SeatBookingSchema.js";

const app = express();
app.use(json());

// Function to check seat availability and reserve seats
const reserveSeats = async (numSeats) => {
  if (numSeats > 7) {
    throw new Error('You can only reserve up to 7 seats at a time.');
  }

  // Get all available seats sorted by row and seatNumber
  const availableSeats = await Seat.find({ isBooked: false }).sort({ row: 1, seatNumber: 1 });

  if (availableSeats.length < numSeats) {
    throw new Error('Not enough seats available.');
  }

  const reservedSeats = [];
  let seatsNeeded = numSeats;

  // Start filling seats by row
  for (const seat of availableSeats) {
    if (seatsNeeded > 0) {
      reservedSeats.push(seat);
      seatsNeeded--;
      // Mark the seat as reserved
      seat.isBooked = true;
      await seat.save();
    }
    if (seatsNeeded === 0) break;
  }

  return reservedSeats;
};

// Route to reserve seats
app.post('/reserve-seats', async (req, res) => {
  const { numSeats } = req.body;

  try {
    // Validate the number of seats requested
    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res.status(400).json({ success: false, message: 'Invalid number of seats. You can only reserve between 1 and 7 seats.' });
    }

    // Call your function to reserve seats
    const reservedSeats = await reserveSeats(numSeats);

    // Return success response with the reserved seats
    res.status(200).json({
      success: true,
      seats: reservedSeats.map(seat => ({ row: seat.row, seatNumber: seat.seatNumber }))
    });

  } catch (error) {
    // Return error response in case of failure
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to get seat availability
app.get('/getseats', async (req, res) => {
  try {
    const seats = await Seat.find().sort({ row: 1, seatNumber: 1 });
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve seat data.' });
  }
});


export default app;
