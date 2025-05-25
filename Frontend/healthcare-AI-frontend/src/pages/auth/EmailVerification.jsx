import React from 'react';
import EmailVerificationForm from '../../components/AuthForm/EmailVerificationForm';
import AuthLayout from '../../components/Layout/AuthLayout';

const EmailVerification = () => {  
  return (
    <AuthLayout>
      <EmailVerificationForm />
    </AuthLayout>
  );
};

export default EmailVerification;
