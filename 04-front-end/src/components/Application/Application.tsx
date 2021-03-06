import React from 'react';
import { Container } from 'react-bootstrap';
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
import AdminQuestionAnswerList from '../Administrator/Dashboard/AdminQuestionAnswerList';
import AdminQuestionAdd from '../Administrator/Dashboard/AdminQuestionAdd';
import AdminQuestionEdit from '../Administrator/Dashboard/AdminQuestionEdit';
import UserRegisterPage from '../User/UserRegisterPage/UserRegisterPage';
import QuizPage from '../Pages/QuizPage/QuizPage';

function Application() {
  return (
    <Container className="mt-4">
      <Menu />
      <Routes>
        <Route path='/' element={<div></div>} />
        <Route path='/contact' element={<ContactPage />} />

        <Route path='/auth/administrator/login' element={<AdministratorLoginPage />} />
        <Route path='/auth/user/login' element={<UserLoginPage />} />
        <Route path='/auth/user/register' element={<UserRegisterPage />} />

        {/* TODO <Route path="/questions" element={<UserQuestionList />} /> */}
        {/* TODO <Route path="/question/add" element={<UserQuestionAdd />} /> */}
        {/* TODO <Route path="/question/:qid/edit" element={<UserQuestionEdit />} /> */}
        {/* TODO <Route path="/question/:qid/answers/list" element={<UserQuestionAnswerList />} /> */}

        {/* TODO <Route path="/profile" element={<UserProfile />} /> */}
        {/* TODO <Route path="/myscores" element={<UserScoresPage />} /> */}

        <Route path="/quiz" element={<QuizPage />} />

        {/* TODO <Route path="/scores" element={<HighScoresPage />} /> */}

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/question/list" element={<AdminQuestionList />} />
        <Route path="/admin/dashboard/question/add" element={<AdminQuestionAdd />} />
        <Route path="/admin/dashboard/question/:qid/edit" element={<AdminQuestionEdit />} />
        <Route path="/admin/dashboard/question/:qid/answers/list" element={<AdminQuestionAnswerList />} />

        <Route path='/admin/dashboard/answer/list' element={<AdminAnswerList />} />
        {/* TODO <Route path='/admin/dashboard/answer/add' element={<AdminAnswerAdd />} />
        TODO <Route path='/admin/dashboard/answer/edit' element={<AdminAnswerEdit />} /> */}

        <Route path="/admin/dashboard/administrator/list" element={<AdminAdministratorList />} />
        <Route path="/admin/dashboard/administrator/add" element={<AdminAdministratorAdd />} />

        <Route path="/admin/dashboard/user/list" element={<AdminUserList />} />
      </Routes>
    </Container>
  );
}

export default Application;
