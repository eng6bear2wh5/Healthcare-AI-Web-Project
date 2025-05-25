import React from 'react';
import ResetPasswordForm from '../../components/AuthForm/ResetPasswordForm';
import AuthLayout from '../../components/Layout/AuthLayout';

const ResetPassword = () => {  
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
