import express, { json } from 'express';
import mongoose from 'mongoose';
import Seat from "../models/SeatBookingSchema.js" ;

const app = express();
app.use(json());


// Route to reserve seats
app.post('/reserve-seats', async (req, res) => {
  const { numSeats } = req.body;

  try {
    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res.status(400).json({ success: false, message: 'Invalid number of seats. You can only reserve between 1 and 7 seats.' });
    }

    const reservedSeats = await reserveSeats(numSeats);
    res.status(200).json({
      success: true,
      seats: reservedSeats.map(seat => ({ row: seat.row, seatNumber: seat.seatNumber }))
    });

  } catch (error) {
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