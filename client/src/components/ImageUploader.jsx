/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";

const ImageUploader = ({ photos, setPhotos }) => {
  const [photoByLink, setByPhotoLink] = useState([]);

  // Add photo Function
  async function handleAddPhotoByLink(event) {
    event.preventDefault();
    // Extracting the filename from the image link
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoByLink,
    });

    // Returning the previous value and the new file name
    // Calling setAddPhotos in this case is to get the upload picture to be shown on the frontend
    setPhotos((prev) => {
      return [...prev, filename];
    });

    setByPhotoLink("");
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
        setPhotos((prev) => {
          return [...prev, ...filenames];
        });
        // console.log(data);
      });

    // console.log(data);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          name="photoLink"
          placeholder="jpg, png...."
          value={photoByLink}
          onChange={(event) => setByPhotoLink(event.target.value)}
        />
        <button
          disabled={!photoByLink.length > 0}
          className={`bg-gray-200 px-4 rounded-2xl ${
            !photoByLink.length &&
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
        {photos.length > 0 &&
          photos.map((link) => (
            <div key={link} className="h-32 flex">
              <img
                src={"http://localhost:8000/uploads/" + link}
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
    </div>
  );
};

export default ImageUploader;
