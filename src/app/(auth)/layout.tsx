import React from 'react';
import Header from '../components/header';

const LoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default LoginLayout;
