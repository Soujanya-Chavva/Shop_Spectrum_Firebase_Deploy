import React, { useState, useEffect } from "react";

const ImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, images]);

  return (
    <div>
      <img className = "image" src={images[currentIndex]} alt={`Image ${currentIndex}`} />
    </div>
  );
};

export default ImageSlideshow;