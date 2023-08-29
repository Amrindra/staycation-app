import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PerksSection from "../components/PerksSection";
import axios from "axios";

const PlacesPage = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addPhotos, setAddPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

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

  // Add photo Function
  async function handleAddPhotoByLink(event) {
    event.preventDefault();
    // Extracting the filename from the image link
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });

    // Returning the previous value and the new file name
    // Calling setAddPhotos in this case is to get the upload picture to be shown on the frontend
    setAddPhotos((prev) => {
      return [...prev, filename];
    });

    setPhotoLink("");
  }

  // Upload Photos function from the local computer
  const handleUploadPhoto = (event) => {
    const files = event.target.files;
    const data = new FormData();

    for (let i in files) {
      data.append("images", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddPhotos((prev) => {
          return [...prev, ...filenames];
        });
        // console.log(data);
      });

    console.log(data);
  };

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
            {inputInfo("Photos", "The more the sbetter")}
            <div className="flex gap-2">
              <input
                type="text"
                name="photoLink"
                placeholder="jpg, png...."
                required
                value={photoLink}
                onChange={(event) => setPhotoLink(event.target.value)}
              />
              <button
                disabled={!photoLink.length > 0}
                className={`bg-gray-200 px-4 rounded-2xl ${
                  !photoLink.length &&
                  "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleAddPhotoByLink}
              >
                Add&nbsp;Photo
              </button>
            </div>

            {/* Upload photo button section */}
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {/* Only show when there is a image */}
              {addPhotos.length > 0 &&
                addPhotos.map((link) => (
                  <div key={link}>
                    <img
                      src={"http://localhost:4000/uploads/" + link}
                      alt="photo upload"
                      className="w-full object-cover rounded-2xl"
                    />
                  </div>
                ))}

              <label className="cursor-pointer flex justify-center items-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>
            {/*End of upload section */}

            {inputInfo("Description", "Dsescription of the place")}
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {inputInfo("Perks", "select all the perks of your place")}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <PerksSection />
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
