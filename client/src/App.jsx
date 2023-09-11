import { Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import UserProfilePage from "./pages/UserProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import SinglePlacePage from "./pages/SinglePlacePage";
import AllBookingsPage from "./pages/AllBookingsPage";
import SingleBookingPage from "./pages/SingleBookingPage";

// Config Defaults. You can specify config defaults that will be applied to every request.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<UserProfilePage />} />
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<PlacesFormPage />} />
        <Route path="/account/places/:id" element={<PlacesFormPage />} />
        <Route path="/account/bookings/" element={<AllBookingsPage />} />
        <Route path="/account/bookings/:id" element={<SingleBookingPage />} />
        <Route path="/place/:id" element={<SinglePlacePage />} />
      </Route>
    </Routes>
  );
}

export default App;
