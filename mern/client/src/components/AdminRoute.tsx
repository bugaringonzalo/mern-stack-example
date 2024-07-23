import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.tsx';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  
  console.log(user);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;