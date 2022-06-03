import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import LoginPage from '../User/LoginPage/LoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from '../Menu/Menu';

function Application() {
  return (
    <Container className="mt-4">
      <Menu />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<div></div>} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/auth/user/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;
