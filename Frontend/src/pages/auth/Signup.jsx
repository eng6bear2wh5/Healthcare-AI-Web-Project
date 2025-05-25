import React from 'react';
import SignupForm from '../../components/AuthForm/SignupForm';
import AuthLayout from '../../components/Layout/AuthLayout';

const Signup = () => {  
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
