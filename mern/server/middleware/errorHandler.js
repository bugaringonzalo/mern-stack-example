export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error' });
    }
  
    res.status(500).json({ message: 'Something went wrong on the server' });
  };
  
  export default errorHandler;