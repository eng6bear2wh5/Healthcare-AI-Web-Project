import React from 'react';
import ForgotPasswordForm from '../../components/AuthForm/ForgotPasswordForm';
import AuthLayout from '../../components/Layout/AuthLayout';

const ForgotPassword = () => {  
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
