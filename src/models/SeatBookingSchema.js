import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  
  row: { type: Number, required: true },
  seatNumber: { type: Number, required: true },
  isBooked: { type: Boolean, default: false } 
});

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
