import { ComponentType } from 'react';
import { JSX } from 'react/jsx-runtime';

const withAuth = (Component: ComponentType) => {
  return (props: JSX.IntrinsicAttributes) => {
    const token = localStorage.getItem('auth');
    if (!token) {
      window.location.href = '/login';
    }
    return <Component {...props} />;
  };
};

export default withAuth;
