import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const EmailVerification: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string>('Verifying...');
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setVerificationStatus(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setVerificationStatus('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Email Verification</Typography>
      {verificationStatus === 'Verifying...' ? (
        <CircularProgress />
      ) : (
        <Typography>{verificationStatus}</Typography>
      )}
    </Box>
  );
};

export default EmailVerification;