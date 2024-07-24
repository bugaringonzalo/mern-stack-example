import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Bed {
    _id: number;
    name: string;
    description: string;
}

interface User {
    _id: number;
    name: string;
    email: string;
    role: ['user', 'admin'];
}

interface Reservation {
  _id: number;
  date: string;
  time: string;
  bedId: Bed;
  userId: User;
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
      const response = await axios.get('/api/reservations/mine');
      setUpcomingReservations(response.data);
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get('/api/availability/');
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
  const handleCancelReservation = async (reservationId: number) => {
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/reservations/${reservationId}`);
          await fetchUpcomingReservations();
          Swal.fire(
            'Cancelled!',
            'Your reservation has been cancelled.',
            'success'
          );
        }
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to cancel reservation. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Reservations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Bed</TableCell>
              <TableCell>User ID</TableCell> {/* Add this line */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingReservations.map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>{dateFormat(reservation.date)}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.bedId.name}</TableCell>
                <TableCell>{reservation.userId.email}</TableCell> {/* Add this line */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCancelReservation(reservation._id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;