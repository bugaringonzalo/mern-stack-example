import React from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import UserManagement from './UserManagement.tsx';
import ReservationsManagement from './ReservationsManagement.tsx';
import BedsManagement from './BedsManagement.tsx';

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
          <Typography component={'span'}>{children}</Typography>
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
        <ReservationsManagement />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BedsManagement />
      </TabPanel>
    </Box>
  );
};

export default AdminPanel;