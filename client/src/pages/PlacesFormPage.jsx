import { useEffect, useState } from "react";
import ImageUploader from "../components/ImageUploader";
import PerksSection from "../components/PerksSection";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProfileNavigation from "../components/ProfileNavigation";

const PlacesForm = () => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);

  const { id } = useParams();
  const navigate = useNavigate();

  // For editing the or update the places form input
  // This useEffect will run when a user clicks on the my accommodations with their id being passed on
  useEffect(() => {
    if (!id) return;

    axios.get(`/places/${id}`).then((response) => {
      const { data } = response;

      setTitle(data.title);
      setAddress(data.address);
      setPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  // For Header Text section
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

  async function handleSubmit(event) {
    event.preventDefault();

    const placeData = {
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    // Using id to verify if we should update existing data or save the new data from the form input
    // If the id exist update the existing data otherwise create new ones
    if (id) {
      // Updating the existing data
      await axios.put("/places", { id, ...placeData });
      navigate("/account/places");
    } else {
      // Create the new places data to the database
      await axios.post("/places", placeData);
      navigate("/account/places");
    }
  }

  return (
    <div>
      <ProfileNavigation />

      <form onSubmit={handleSubmit}>
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
        <ImageUploader photos={photos} setPhotos={setPhotos} />

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
  );
};

export default PlacesForm;
