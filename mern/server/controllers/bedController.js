import Bed from '../models/Bed.js';

export const createBed = async (req, res) => {
  try {
    const { name, description } = req.body;
    const bed = new Bed({ name, description });
    await bed.save();
    res.status(201).json(bed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBed = async (req, res) => {
  try {
    const { name, description } = req.body;
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json(bed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    res.json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default { createBed, getBeds, updateBed, deleteBed };