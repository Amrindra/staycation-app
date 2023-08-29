import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PerksSection from "../components/PerksSection";
import ImageUploader from "../components/ImageUploader";

const PlacesPage = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [addPhotos, setAddPhotos] = useState([]);

  function inputHeader(text) {
    return <label className="text-2xl mt-4">{text}</label>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  // A custom function to resuse and replace the label and p tag
  function inputInfo(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  return (
    <div>
      <div className="text-center">
        {action !== "new" && (
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Add new place
          </Link>
        )}
      </div>

      {action === "new" && (
        <div className="">
          <form>
            {inputInfo("Title", "Title for your place.")}
            <input
              type="text"
              name="title"
              placeholder="EX: My cozy gateaway"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {inputInfo("Address", "Address to this place")}
            <input
              type="text"
              name="address"
              placeholder="EX: 123 Happy street"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />

            {/* Image uploader section */}
            {inputInfo("Photos", "The more the better")}
            <ImageUploader addPhotos={addPhotos} setAddPhotos={setAddPhotos} />

            {inputInfo("Description", "Dsescription of the place")}
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            {/* PERK SECTION */}
            {inputInfo("Perks", "select all the perks of your place")}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <PerksSection selectedPerk={perks} onChange={setPerks} />
            </div>

            {inputInfo("Extra info", "House rules, etc")}
            <textarea
              value={extraInfo}
              onChange={(event) => setExtraInfo(event.target.value)}
            />
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  placeholder="3 PM"
                  value={checkIn}
                  onChange={(event) => setCheckIn(event.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="text"
                  placeholder="12 AM"
                  value={checkOut}
                  onChange={(event) => setCheckOut(event.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(event) => setMaxGuests(event.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="primary my-4">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;
