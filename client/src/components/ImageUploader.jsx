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

  const handleRemovePhoto = (removePhotoLink) => {
    setPhotos([...photos.filter((photo) => photo !== removePhotoLink)]);
  };

  const handleSetAsMainPhoto = () => {};

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
      <div className=" mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {/* Only show when there is a image */}
        {photos.length > 0 &&
          photos.map((link) => (
            <div key={link} className="relative h-32 flex">
              <img
                src={"http://localhost:8000/uploads/" + link}
                alt="photo upload"
                className="w-full object-cover rounded-2xl"
              />

              <button
                onClick={() => handleSetAsMainPhoto(link)}
                className="absolute left-1 text-white bg-black bg-opacity-50 rounded-xl p-2 px-2 cursor-pointer"
              >
                {/* Checking if the link is the same as the link of set a main photo */}
                {link === photos[0] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red-600"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleRemovePhoto(link)}
                className="absolute bottom-2 right-1 text-white bg-black bg-opacity-50 rounded-xl p-2 px-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
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
