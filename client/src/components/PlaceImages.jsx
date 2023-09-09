/* eslint-disable react/prop-types */

import Image from "./Image";

const PlaceImages = ({ place, index = 0, className = null }) => {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }

  return (
    <>
      <Image src={place.photos[index]} alt="" className={className} />
    </>
  );
};

export default PlaceImages;
