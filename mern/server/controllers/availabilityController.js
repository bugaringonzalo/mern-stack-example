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


export default { getAvailability, getAvailabilities, getBedsAvailables };

