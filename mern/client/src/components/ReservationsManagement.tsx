import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Reservation {
  _id: string;
  userId: User;
  userName: string;
  userEmail: string;
  createdByUserId: string;
  bedId: Bed;
  date: string;
  time: string;
}

interface Bed {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const ReservationsManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState<Partial<Reservation>>({
    userId: '' as unknown as User,
    bedId: '' as unknown as Bed,
    date: '',
    time: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchReservations();
    fetchBeds();
    fetchUsers();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setSnackbar({ open: true, message: 'Error fetching reservations' });
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await axios.get('/api/beds');
      setBeds(response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setSnackbar({ open: true, message: 'Error fetching beds' });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({ open: true, message: 'Error fetching users' });
    }
  };

  const handleCreateReservation = async () => {
    try {
      await axios.post('/api/reservations/admin-create', newReservation);
      setOpenDialog(false);
      setNewReservation({
        userId: '' as unknown as User,
        bedId: '' as unknown as Bed,
        date: '',
        time: ''
      });
      fetchReservations();
      setSnackbar({ open: true, message: 'Reservation created successfully' });
    } catch (error) {
      console.error('Error creating reservation:', error);
      setSnackbar({ open: true, message: 'Error creating reservation' });
    }
  };

  const handleEditReservation = async () => {
    if (!editReservation) return;
    try {
      await axios.put(`/api/reservations/${editReservation._id}`, editReservation);
      setOpenDialog(false);
      setEditReservation(null);
      fetchReservations();
      setSnackbar({ open: true, message: 'Reservation updated successfully' });
    } catch (error) {
      console.error('Error updating reservation:', error);
      setSnackbar({ open: true, message: 'Error updating reservation' });
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await axios.delete(`/api/reservations/admin-delete/${id}`);
      fetchReservations();
      setSnackbar({ open: true, message: 'Reservation deleted successfully' });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setSnackbar({ open: true, message: 'Error deleting reservation' });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '1rem' }}
      >
        Create Reservation
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Bed</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations &&
            reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>{reservation.userName}</TableCell>
                <TableCell>{reservation.userEmail}</TableCell>
                <TableCell>{reservation.bedId.name}</TableCell>
                <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditReservation(reservation); setOpenDialog(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteReservation(reservation._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditReservation(null); }}>
        <DialogTitle>{editReservation ? 'Edit Reservation' : 'Create Reservation'}</DialogTitle>
        <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>User</InputLabel>
          <Select
            value={editReservation ? editReservation.userId._id : newReservation.userId?._id || ''}
            onChange={(e) => {
              const selectedUser = users.find(user => user._id === e.target.value);
              if (selectedUser) {
                editReservation 
                  ? setEditReservation({...editReservation, userId: selectedUser, userName: selectedUser.name, userEmail: selectedUser.email})
                  : setNewReservation({...newReservation, userId: selectedUser, userName: selectedUser.name, userEmail: selectedUser.email});
              }
            }}
          >
            {users.map(user => (
              <MenuItem key={user._id} value={user._id}>{user.name} ({user.email})</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Bed</InputLabel>
          <Select
            value={editReservation ? editReservation.bedId._id : newReservation.bedId?._id || ''}
            onChange={(e) => {
              const selectedBed = beds.find(bed => bed._id === e.target.value);
              if (selectedBed) {
                editReservation 
                  ? setEditReservation({...editReservation, bedId: selectedBed})
                  : setNewReservation({...newReservation, bedId: selectedBed});
              }
            }}
          >
            {beds.map(bed => (
              <MenuItem key={bed._id} value={bed._id}>{bed.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={editReservation ? editReservation.date.split('T')[0] : newReservation.date}
            onChange={(e) => editReservation ? setEditReservation({...editReservation, date: e.target.value}) : setNewReservation({...newReservation, date: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            value={editReservation ? editReservation.time : newReservation.time}
            onChange={(e) => editReservation ? setEditReservation({...editReservation, time: e.target.value}) : setNewReservation({...newReservation, time: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditReservation(null); }}>Cancel</Button>
          <Button onClick={editReservation ? handleEditReservation : handleCreateReservation} color="primary">
            {editReservation ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export default ReservationsManagement;