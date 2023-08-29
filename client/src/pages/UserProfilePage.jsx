import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacePage";
import ProfileNavigation from "../components/ProfileNavigation";

const UserProfilePage = () => {
  const [redirectToHomepage, setRedirectToHomepage] = useState(null);
  const { loading, user, setUser } = useContext(UserContext);

  // Using useParams to grab the subpage params from the App.jsx
  let { subpage } = useParams();
  // Checking if the subpage is undefine, make the profile page active by setting the subpage to "profile"
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirectToHomepage("/");
    setUser(null);
  }

  // Checking if there is no user yet, render this loading...
  if (!loading) {
    return <span>Loading...</span>;
  }

  // Checking if there is no user, profile page it should not be visible, it should navigate to login page
  if (loading && !user && !redirectToHomepage) {
    return <Navigate to={"/login"} />;
  }

  if (redirectToHomepage) {
    return <Navigate to={redirectToHomepage} />;
  }

  return (
    <div>
      <ProfileNavigation />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default UserProfilePage;
