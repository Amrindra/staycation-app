/* eslint-disable react/prop-types */

const PlaceImages = ({ place, index = 0, className = null }) => {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }

  return (
    <>
      <img
        src={`http://localhost:8000/uploads/${place.photos[index]}`}
        alt=""
        className={className}
      />
    </>
  );
};

export default PlaceImages;
