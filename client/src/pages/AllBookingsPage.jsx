import { useEffect, useState } from "react";
import ProfileNavigation from "../components/ProfileNavigation";
import axios from "axios";

const AllBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then((response) => setBookings(response.data));
  }, []);

  console.log(bookings);

  return (
    <div>
      <ProfileNavigation />

      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div key={booking._id}>
              {booking.checkIn} to {booking.checkOut}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllBookingsPage;
