import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import Swal from 'sweetalert2';
// import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// interface Availability {
//   availableHours: number[];
// }


interface AvailableSlots {
  bedName: string;
  bedId: number;
  availableHours: number[];
}

interface Bed {
  _id: number;
  name: string;
  description: string;
}

const BookingSystem: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [availableSlots, SetAvailableSlots] = useState<AvailableSlots[]>([]);
  const [allBeds, setAllBeds] = useState<Bed[]>([]);

  // const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBeds = async () => {
    try {
      const response = await axios.get('/api/beds');
      setAllBeds(response.data);
      console.log('state allBeds:', response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch beds. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  const fetchAvailability = async () => {
    try {
      const response = await axios.get('/api/availability/by-date', {
        params: {
          date: selectedDate?.toISOString().split('T')[0],
          // bedId: selectedBed?._id,
        },
      });
      
      SetAvailableSlots(response.data);
      console.log('state Available slots:', response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch availability. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || !selectedBed || !selectedHour) {
      Swal.fire({
        title: 'Incomplete Form',
        text: 'Please fill in all fields',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post('/api/reservations', {
        bedId: selectedBed,
        date: selectedDate.toISOString().split('T')[0],
        time: `${selectedHour.toString().padStart(2, '0')}:00`, // Format time to match pattern
      });
      
      Swal.fire({
        title: 'Success!',
        text: 'Reservation created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard');
        }
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create reservation. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    if (selectedDate && selectedBed) {
      fetchAvailability();
      console.log('selectedDate:', selectedDate);
      console.log('selectedBed:', selectedBed);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedBed]);

  useEffect(() => {
    fetchBeds();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Book a Bed
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                // renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Bed</InputLabel>
              <Select
                value={selectedBed}
                label="Select Bed"
                onChange={(e) => setSelectedBed(e.target.value as number)}
              >
                {allBeds.map((bed) => (
                  <MenuItem key={bed._id} value={bed._id}>
                    {bed.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Hour</InputLabel>
              <Select
                value={selectedHour}
                label="Select Hour"
                onChange={(e) => setSelectedHour(e.target.value as number)}
              >
                {selectedBed !== null && availableSlots.length > 0 &&
                  
                  availableSlots.find((slot) => slot.bedId === selectedBed)?.availableHours.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}:00
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