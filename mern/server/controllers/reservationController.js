import Reservation from '../models/Reservation.js';
import Bed from '../models/Bed.js';
// import the User collection so i can add the user id and the name and mail of the user to the reservation
import User from '../models/User.js';

export const createReservation = async (req, res, next) => {
    try {
      const { bedId, date, time } = req.body;
      
      // Check if the bed exists
      const bed = await Bed.findById(bedId);
      if (!bed) {
        return res.status(404).json({ message: 'Bed not found' });
      }
  
      // Check if the bed is already reserved for the given date and time
      const existingReservation = await Reservation.findOne({ bedId, date, time });
      if (existingReservation) {
        return res.status(400).json({ message: 'This bed is already reserved for the given time' });
      }
  
      // Check if the user has already made 3 reservations for the given date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const userInfo = await User.findById(req.user._id).select('name email');

      if (!userInfo) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userReservationsCount = await Reservation.countDocuments({
        userId: req.user._id,
        date: { $gte: startOfDay, $lte: endOfDay }
      });
  
      if (userReservationsCount >= 3) {
        return res.status(400).json({ message: 'You can only make 3 reservations per day' });
      }
  
      const reservation = new Reservation({
        userId: req.user._id,
        userName: userInfo.name,
        userEmail: userInfo.email,
        createdByUserId: req.user._id,
        bedId,
        date,
        time
      });
  
      await reservation.save();
      res.status(201).json(reservation);
    } catch (error) {
        next(error);
    }
  };

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).populate('bedId');
    res.json(reservations);
    } catch (error) {
        next(error);
    }
};

export const updateReservation = async (req, res) => {
  try {
    const { bedId, date, time } = req.body;
    const reservation = await Reservation.findOne({ _id: req.params.id, userId: req.user._id });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the new bed, date, and time are available
    if (bedId !== reservation.bedId.toString() || date !== reservation.date.toISOString() || time !== reservation.time) {
      const existingReservation = await Reservation.findOne({ bedId, date, time });
      if (existingReservation) {
        return res.status(400).json({ message: 'This bed is already reserved for the given time' });
      }
    }

    reservation.bedId = bedId;
    reservation.date = date;
    reservation.time = time;

    await reservation.save();
    res.json(reservation);
    } catch (error) {
        next(error);
    }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export default { createReservation, getReservations, updateReservation, deleteReservation };