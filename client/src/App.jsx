import { Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import UserProfilePage from "./pages/UserProfilePage";

// Config Defaults. You can specify config defaults that will be applied to every request.
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/:subpage?" element={<UserProfilePage />} />
        <Route path="/account/:subpage/:action" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
