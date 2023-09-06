import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const BookingWidgets = ({ places }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  // Checking the quantity of staying day
  // the "differenceInCalendarDays" comes from the date-fns libray
  let numberOfStayingDays = 0;
  if (checkIn && checkOut) {
    numberOfStayingDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  // Get the total of booking price
  const totalPrice = numberOfStayingDays * places.price;

  // TO handle the booking
  const handleBooking = async () => {
    const bookingData = {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      email,
      phone,
      placeId: places._id,
      price: totalPrice,
    };

    const response = await axios.post("/bookings", bookingData);
    const bookingId = await response.data._id;
    navigate(`/account/bookings/${bookingId}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow">
        <p className="text-2xl text-center">Price: ${places.price} / night</p>
        <div className=" border border-slate-400 rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check In: </label>
              <input
                onChange={(event) => setCheckIn(event.target.value)}
                value={checkIn}
                type="date"
              />
            </div>
            <div className="py-3 px-4 border-l border-slate-400">
              <label>Check Out: </label>
              <input
                onChange={(event) => setCheckOut(event.target.value)}
                value={checkOut}
                type="date"
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t border-slate-400">
            <label>Number of guests: </label>
            <input
              onChange={(event) => setNumberOfGuests(event.target.value)}
              value={numberOfGuests}
              type="number"
              className="border-inherit"
            />
          </div>

          {/* Render only when a user starts checkIn and Checkout date */}
          {numberOfStayingDays > 0 && (
            <div className="py-3 px-4 border-t border-slate-400">
              <label>Name:</label>
              <input
                type="text"
                placeholder="First Name"
                onChange={(event) => setName(event.target.value)}
                value={name}
                className="border-inherit"
              />

              <label>Email:</label>
              <input
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                className="border-inherit"
              />

              <label>Phone:</label>
              <input
                type="tel"
                placeholder="Phone Number"
                onChange={(event) => setPhone(event.target.value)}
                value={phone}
                className="border-inherit"
              />
            </div>
          )}
        </div>
        <button onClick={handleBooking} className="primary">
          Book this place{" "}
          {numberOfStayingDays > 0 && <span>${totalPrice}</span>}
        </button>
      </div>
    </>
  );
};

export default BookingWidgets;
