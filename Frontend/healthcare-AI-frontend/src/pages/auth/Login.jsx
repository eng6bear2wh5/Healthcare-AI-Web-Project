import React from 'react';
import LoginForm from '../../components/AuthForm/LoginForm';
import AuthLayout from '../../components/Layout/AuthLayout';

const Login = () => {  
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
