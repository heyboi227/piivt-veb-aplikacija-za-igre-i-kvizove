import React from 'react';
import { Container } from 'react-bootstrap';
import LoginPage from '../User/UserLoginPage/UserLoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Menu/Menu';

function Application() {
  return (
    <Container className="mt-4">
      <Menu />
        <Routes>
          <Route path='/' element={<div></div>} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/auth/user/login' element={<LoginPage />} />
        </Routes>
    </Container>
  );
}

export default Application;
