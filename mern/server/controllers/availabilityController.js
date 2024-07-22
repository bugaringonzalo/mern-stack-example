import Bed from "../models/Bed.js";
import Reservation from "../models/Reservation.js";

export const getAvailability = async (req, res) => {
    try {
        const { bedId, date, time } = req.query;
        const reservation = await Reservation.findOne({ bedId, date, time });
        res.json({ isAvailable: !reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    };

export const getAvailabilities = async (req, res) => {
    try {
        const availabilities = await Reservation.find();
        res.json(availabilities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }

export const getBedsAvailables = async (req, res) => {
    try {
        const { date, time } = req.query;
        const reservations = await Reservation.find({ date, time });
        const bedIds = reservations.map((reservation) => reservation.bedId);
        const beds = await Bed.find({ _id: { $nin: bedIds } });
        res.json(beds);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }

    export const getAvailabilityByDate = async (req, res) => {
        const { date } = req.query;
        
        try {
          const allBeds = await Bed.find(); // Assuming Bed.find() fetches all beds, similar to findAll() in some ORMs
          
          const reservations = await Reservation.find({
            date: date,
          });
          console.log(reservations, allBeds);
          
          const availability = allBeds.map(bed => {
            const bedReservations = reservations.filter(r => r.bedId.equals(bed._id)); // Assuming MongoDB's _id is used, and using equals for ObjectId comparison
            const availableHours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
              .filter(hour => !bedReservations.some(r => {
                const reservationHour = new Date(r.time).getHours(); // Assuming time is stored in a Date-compatible format
                return reservationHour === hour;
              }));
            
            return {
              bedId: bed._id,
              bedName: bed.name,
              availableHours,
            };
          });
          console.log(availability);
          res.json(availability);
        } catch (error) {
          console.error('Error fetching availability:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };

export const getAvailabilityByBedAndDate = async (req, res) => {
    const { bedId, date } = req.query;
    
    try {
      const reservations = await Reservation.find({
        bedId,
        date,
      });
      
      const availability = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
        .filter(hour => !reservations.some(r => {
          const reservationHour = new Date(r.time).getHours(); // Assuming time is stored in a Date-compatible format
          return reservationHour === hour;
        }));
      
      res.json(availability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export default { getAvailability, getAvailabilities, getBedsAvailables, getAvailabilityByDate, getAvailabilityByBedAndDate };

