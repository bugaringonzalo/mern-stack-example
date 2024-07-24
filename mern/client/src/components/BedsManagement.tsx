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
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Bed {
  _id: string;
  name: string;
  description: string;
}

const BedsManagement: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editBed, setEditBed] = useState<Bed | null>(null);
  const [newBed, setNewBed] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      const response = await axios.get('/api/beds');
      setBeds(response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const handleCreateBed = async () => {
    try {
      await axios.post('/api/beds', newBed);
      setOpenDialog(false);
      setNewBed({ name: '', description: '' });
      fetchBeds();
    } catch (error) {
      console.error('Error creating bed:', error);
    }
  };

  const handleEditBed = async () => {
    if (!editBed) return;
    try {
      await axios.put(`/api/beds/${editBed._id}`, editBed);
      setOpenDialog(false);
      setEditBed(null);
      fetchBeds();
    } catch (error) {
      console.error('Error updating bed:', error);
    }
  };

  const handleDeleteBed = async (id: string) => {
    try {
      await axios.delete(`/api/beds/${id}`);
      fetchBeds();
    } catch (error) {
      console.error('Error deleting bed:', error);
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
        Create Bed
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beds.map((bed) => (
              <TableRow key={bed._id}>
                <TableCell>{bed.name}</TableCell>
                <TableCell>{bed.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setEditBed(bed); setOpenDialog(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBed(bed._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditBed(null); }}>
        <DialogTitle>{editBed ? 'Edit Bed' : 'Create Bed'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editBed ? editBed.name : newBed.name}
            onChange={(e) => editBed ? setEditBed({...editBed, name: e.target.value}) : setNewBed({...newBed, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editBed ? editBed.description : newBed.description}
            onChange={(e) => editBed ? setEditBed({...editBed, description: e.target.value}) : setNewBed({...newBed, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditBed(null); }}>Cancel</Button>
          <Button onClick={editBed ? handleEditBed : handleCreateBed} color="primary">
            {editBed ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BedsManagement;