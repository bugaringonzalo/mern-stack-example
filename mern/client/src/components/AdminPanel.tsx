import React from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import UserManagement from './UserManagement.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AdminPanel: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="admin panel tabs">
          <Tab label="User Management" />
          <Tab label="Reservations" />
          <Tab label="Beds" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserManagement />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Reservations Management (To be implemented)
      </TabPanel>
      <TabPanel value={value} index={2}>
        Beds Management (To be implemented)
      </TabPanel>
    </Box>
  );
};

export default AdminPanel;

// import React, { useState, useEffect } from 'react';
// import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
// import axios from 'axios';

// interface Reservation {
//   _id: number;
//   userName: string;
//   userEmail: string;
//   createdByUserId: number;
//   date: string;
//   time: string;
//   bedId: Bed;
//   userId: User;
// }

// interface User {
//     _id: number;
//     name: string;
//     email: string;
//     role: ['user', 'admin'];
// }

// interface Bed {
//   _id: number;
//   name: string;
//   description: string;
// }

// const AdminPanel: React.FC = () => {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [beds, setBeds] = useState<Bed[]>([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newBedName, setNewBedName] = useState('');
//   const [newBedDescription, setNewBedDescription] = useState(''); // Added state for Bed Description

//   useEffect(() => {
//     fetchReservations();
//     fetchBeds();
//   }, []);

//   const fetchReservations = async () => {
//     try {
//       const response = await axios.get('/api/reservations');
//       setReservations(response.data);
//     } catch (error) {
//       console.error('Error fetching reservations:', error);
//     }
//   };

//   const fetchBeds = async () => {
//     try {
//       const response = await axios.get('/api/beds');
//       setBeds(response.data);
//     } catch (error) {
//       console.error('Error fetching beds:', error);
//     }
//   };

//   const handleAddBed = async () => {
//     try {
//       await axios.post('/api/beds', { name: newBedName, description: newBedDescription });
//       setOpenDialog(false);
//       setNewBedName('');
//       setNewBedDescription(''); // Reset Bed Description
//       fetchBeds();
//     } catch (error) {
//       console.error('Error adding bed:', error);
//     }
//   };

//   const handleDeleteBed = async (bedId: number) => {
//     try {
//       await axios.delete(`/api/beds/${bedId}`);
//       fetchBeds();
//     } catch (error) {
//       console.error('Error deleting bed:', error);
//     }
//   };

//   return (
//     <Box sx={{ flexGrow: 1, padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Admin Panel
//       </Typography>
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h5" gutterBottom>
//           Reservations
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>User Name</TableCell>
//                 <TableCell>Time</TableCell>
//                 <TableCell>Bed ID</TableCell>
//                 <TableCell>Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reservations.length > 0 ? reservations.map((reservation) => (
//                 <TableRow key={reservation._id}>
//                   <TableCell>{reservation._id}</TableCell>
//                   <TableCell>{reservation.userName}</TableCell>
//                   <TableCell>{reservation.date}</TableCell>
//                   <TableCell>{reservation.time}</TableCell>
//                   <TableCell>{reservation.bedId.name}</TableCell>
//                 </TableRow>
//               ))
//                 : <TableRow>
//                     <TableCell colSpan={5} align="center">No reservations found</TableCell>
//                     </TableRow>    
//             }
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//       <Box>
//         <Typography variant="h5" gutterBottom>
//           Beds
//         </Typography>
//         <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
//           Add New Bed
//         </Button>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {beds.map((bed) => (
//                 <TableRow key={bed._id}>
//                 <TableCell>{bed._id}</TableCell>
//                 <TableCell>{bed.name}</TableCell>
//                 <TableCell>
//                   <Button variant="outlined" color="secondary" onClick={() => handleDeleteBed(bed._id)}>
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//   <DialogTitle>Add New Bed</DialogTitle>
//   <DialogContent>
//     <TextField
//       autoFocus
//       margin="dense"
//       label="Bed Name"
//       type="text"
//       fullWidth
//       value={newBedName}
//       onChange={(e) => setNewBedName(e.target.value)}
//     />
//     {/* Added TextField for Bed Description */}
//     <TextField
//       margin="dense"
//       label="Bed Description"
//       type="text"
//       fullWidth
//       multiline
//       rows={4}
//       value={newBedDescription} // Assume newBedDescription state exists
//       onChange={(e) => setNewBedDescription(e.target.value)} // Assume setNewBedDescription function exists
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//     <Button onClick={handleAddBed}>Add</Button>
//   </DialogActions>
// </Dialog>
//   </Box>
// );
// };

// export default AdminPanel;