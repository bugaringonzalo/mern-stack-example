import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

interface Bed {
  _id: number;
  name: string;
}

const BookingSystem: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedBed, setSelectedBed] = useState<number | ''>('');
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAvailableBeds();
    }
  }, [selectedDate, selectedTime,]);

  const fetchAvailableBeds = async () => {
    try {
      const response = await axios.get('/api/availability', {
        params: {
          date: selectedDate?.toISOString().split('T')[0],
          time: selectedTime,
        },
      });
      setAvailableBeds(response.data);
    } catch (error) {
      console.error('Error fetching available beds:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !selectedBed) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('/api/reservations', {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        bedId: selectedBed,
      });
      alert('Reservation created successfully!');
      // Reset form or redirect to dashboard
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Book a Bed
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                // renderInput={(params: any) => <TextField {...params} fullWidth />}

              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Time</InputLabel>
              <Select
                value={selectedTime}
                label="Select Time"
                onChange={(e) => setSelectedTime(e.target.value as string)}
              >
                {/* Add time slots based on your business hours */}
                <MenuItem value="09:00">09:00</MenuItem>
                <MenuItem value="10:00">10:00</MenuItem>
                <MenuItem value="11:00">11:00</MenuItem>
                {/* Add more time slots */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Bed</InputLabel>
              <Select
                value={selectedBed}
                label="Select Bed"
                onChange={(e) => setSelectedBed(e.target.value as number)}
              >
                {availableBeds.map((bed) => (
                  <MenuItem key={bed._id} value={bed._id}>
                    {bed.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Book Reservation
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default BookingSystem;