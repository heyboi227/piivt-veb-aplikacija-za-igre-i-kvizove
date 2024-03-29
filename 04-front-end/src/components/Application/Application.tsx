import React from "react";
import { Container } from "react-bootstrap";
import ContactPage from "../Pages/ContactPage/ContactPage";
import { Routes, Route, useLocation } from "react-router-dom";
import Menu from "../Menu/Menu";
import UserLoginPage from "../User/UserLoginPage/UserLoginPage";
import AdministratorLoginPage from "../Administrator/AdministratorLoginPage/AdministratorLoginPage";
import AdminDashboard from "../Administrator/Dashboard/AdminDashboard";
import AdminQuestionList from "../Administrator/Dashboard/AdminQuestionList";
import AdminUserList from "../Administrator/Dashboard/AdminUserList";
import AdminAdministratorList from "../Administrator/Dashboard/AdminAdministratorList";
import AdminAdministratorAdd from "../Administrator/Dashboard/AdminAdministratorAdd";
import AdminAnswerList from "../Administrator/Dashboard/AdminAnswerList";
import AdminQuestionAnswerList from "../Administrator/Dashboard/AdminQuestionAnswerList";
import AdminQuestionEdit from "../Administrator/Dashboard/AdminQuestionEdit";
import UserRegisterPage from "../User/UserRegisterPage/UserRegisterPage";
import QuizPage from "../Pages/QuizPage/QuizPage";
import UserProfile from "../User/Profile/UserProfile";
import AdminAnswerAdd from "../Administrator/Dashboard/AdminAnswerAdd";
import AdminAnswerEdit from "../Administrator/Dashboard/AdminAnswerEdit";
import UserQuestionList from "../User/Questions/UserQuestionList";
import UserQuestionAdd from "../User/Questions/UserQuestionAdd";
import UserQuestionEdit from "../User/Questions/UserQuestionEdit";
import UserQuestionAnswerList from "../User/Questions/UserQuestionAnswerList";
import HomePage from "../Home/HomePage";
import UserScoresPage from "../User/UserScoresPage/UserScoresPage";
import HighScoresPage from "../Pages/HighScoresPage/HighScoresPage";
import UserPasswordResetPage from "../User/UserPasswordResetPage/UserPasswordResetPage";
import UserDeactivatePage from "../User/UserDeactivatePage/UserDeactivatePage";

function Application() {
  const path = useLocation();
  return (
    <Container className="mt-4">
      {path.pathname === "/quiz" ? null : <Menu />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/auth/administrator/login"
          element={<AdministratorLoginPage />}
        />
        <Route path="/auth/user/login" element={<UserLoginPage />} />
        <Route path="/auth/user/register" element={<UserRegisterPage />} />
        <Route
          path="/auth/user/forgot-password"
          element={<UserPasswordResetPage />}
        />

        <Route path="/question" element={<UserQuestionList />} />
        <Route path="/question/add" element={<UserQuestionAdd />} />
        <Route path="/question/:qid/edit" element={<UserQuestionEdit />} />
        <Route
          path="/question/:qid/answers/list"
          element={<UserQuestionAnswerList />}
        />

        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-scores" element={<UserScoresPage />} />
        <Route path="/deactivate" element={<UserDeactivatePage />} />

        <Route path="/quiz" element={<QuizPage />} />

        <Route path="/high-scores" element={<HighScoresPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/dashboard/question/list"
          element={<AdminQuestionList />}
        />
        <Route
          path="/admin/dashboard/question/:qid/edit"
          element={<AdminQuestionEdit />}
        />
        <Route
          path="/admin/dashboard/question/:qid/answers/list"
          element={<AdminQuestionAnswerList />}
        />

        <Route
          path="/admin/dashboard/answer/list"
          element={<AdminAnswerList />}
        />
        <Route
          path="/admin/dashboard/answer/add"
          element={<AdminAnswerAdd />}
        />
        <Route
          path="/admin/dashboard/answer/:aid/edit"
          element={<AdminAnswerEdit />}
        />

        <Route
          path="/admin/dashboard/administrator/list"
          element={<AdminAdministratorList />}
        />
        <Route
          path="/admin/dashboard/administrator/add"
          element={<AdminAdministratorAdd />}
        />

        <Route path="/admin/dashboard/user/list" element={<AdminUserList />} />
      </Routes>
    </Container>
  );
}

export default Application;
