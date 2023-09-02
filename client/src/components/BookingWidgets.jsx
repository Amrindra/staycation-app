/* eslint-disable react/prop-types */
const BookingWidgets = ({ places }) => {
  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow">
        <p className="text-2xl text-center">Price: ${places.price} / night</p>
        <div className=" border border-slate-400 rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check In: </label>
              <input type="date" />
            </div>
            <div className="py-3 px-4 border-l border-slate-400">
              <label>Check Out: </label>
              <input type="date" />
            </div>
          </div>
          <div className="py-3 px-4 border-t border-slate-400">
            <label>Number of guests: </label>
            <input type="number" className="border-inherit" />
          </div>
        </div>
        <button className="primary">Book this place</button>
      </div>
    </>
  );
};

export default BookingWidgets;
