import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';

interface Bed {
    _id: number;
    name: string;
    description: string;
}

interface Reservation {
  _id: number;
  date: string;
  time: string;
  bedId: Bed;
}

const Dashboard: React.FC = () => {
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ date: string; time: string }[]>([]);

  useEffect(() => {
    fetchUpcomingReservations();
    fetchAvailableSlots();
  }, []);

  const fetchUpcomingReservations = async () => {
    try {
      const response = await axios.get('/api/reservations/');
      setUpcomingReservations(response.data);
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get('/api/reservations/available-slots');
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const dateFormat = (date: string) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const d = new Date(date);
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
  
    return `${dayName} ${day} de ${monthName} ${year}`;
  }

  

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Upcoming Reservations
              </Typography>
              {upcomingReservations.map((reservation) => (
                <Box key={reservation._id} sx={{ mb: 2 }}>
                  <Typography>
                    Date: {dateFormat(reservation.date)}, Time: {reservation.time}, Bed: {reservation.bedId.name}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Available Slots
              </Typography>
              {availableSlots.map((slot, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography>
                    Date: {slot.date}, Time: {slot.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;