import React from 'react';
import { Container } from 'react-bootstrap';
import LoginPage from '../User/UserLoginPage/UserLoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Menu/Menu';
import UserLoginPage from '../User/UserLoginPage/UserLoginPage';
import AdministratorLoginPage from '../Administrator/AdministratorLoginPage/AdministratorLoginPage';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import AdminQuestionList from '../Administrator/Dashboard/AdminQuestionList';
import AdminUserList from '../Administrator/Dashboard/AdminUserList';
import AdminAdministratorList from '../Administrator/Dashboard/AdminAdministratorList';
import AdminAdministratorAdd from '../Administrator/Dashboard/AdminAdministratorAdd';
import AdminAnswerList from '../Administrator/Dashboard/AdminAnswerList';

function Application() {
  return (
    <Container className="mt-4">
      <Menu />
      <Routes>
        <Route path='/' element={<div></div>} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/auth/user/login' element={<UserLoginPage />} />
        {/* TODO <Route path='/auth/user/register' element={<UserRegisterPage />} /> */}
        <Route path='/auth/administrator/login' element={<AdministratorLoginPage />} />
        {/* TODO <Route path="/questions" element={<UserQuestionList />} /> */}
        {/* TODO <Route path="/question/:id" element={<UserQuestionPage />} /> */}

        {/* TODO <Route path="/profile" element={<UserProfile />} /> */}

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/question/list" element={<AdminQuestionList />} />
        {/* TODO <Route path="/admin/dashboard/question/:qid/answers/list" element={<AdminQuestionAnswerList />} />
        TODO <Route path="/admin/dashboard/question/:qid/answers/add" element={<AdminQuestionAnswerAdd />} />
        TODO <Route path="/admin/dashboard/question/:qid/answers/edit/:aid" element={<AdminQuestionAnswerEdit />} /> */}

        <Route path='/admin/dashboard/answer/list' element={<AdminAnswerList />} />
        {/* TODO <Route path='/admin/dashboard/answer/add' element={<AdminAnswerAdd />} />
        TODO <Route path='/admin/dashboard/answer/list' element={<AdminAnswerEdit />} /> */}

        <Route path="/admin/dashboard/administrator/list" element={<AdminAdministratorList />} />
        <Route path="/admin/dashboard/administrator/add" element={<AdminAdministratorAdd />} />

        <Route path="/admin/dashboard/user/list" element={<AdminUserList />} />
      </Routes>
    </Container>
  );
}

export default Application;
