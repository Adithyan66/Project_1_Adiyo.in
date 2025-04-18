// import React from "react";

// import img2 from "../../../assets/images/gucci.png";
// import img3 from "../../../assets/images/prada.png";
// import img4 from "../../../assets/images/versace.png";
// import img5 from "../../../assets/images/zara.png";
// import img1 from "../../../assets/images/calvin.png";

// function Brandadd() {
//   return (
//     <div className="bg-black p-5" style={{ height: "120px" }}>
//       <div className="flex justify-evenly items-center h-full">
//         <img src={img1} alt="Image 1" className="w-auto h-auto" />
//         <img src={img2} alt="Image 2" className="w-auto h-auto" />
//         <img src={img3} alt="Image 3" className="w-auto h-auto" />
//         <img src={img4} alt="Image 4" className="w-auto h-auto" />
//         <img src={img5} alt="Image 5" className="w-auto h-auto" />
//       </div>
//     </div>
//   );
// }

// export default Brandadd;




import React, { useState, useEffect, useRef } from "react";

import img2 from "../../../assets/images/gucci.png";
import img3 from "../../../assets/images/prada.png";
import img4 from "../../../assets/images/versace.png";
import img5 from "../../../assets/images/zara.png";
import img1 from "../../../assets/images/calvin.png";

function Brandadd() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  const brandImages = [
    { src: img1, alt: "Calvin Klein" },
    { src: img2, alt: "Gucci" },
    { src: img3, alt: "Prada" },
    { src: img4, alt: "Versace" },
    { src: img5, alt: "Zara" },
  ];

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-scroll for carousel
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMobile, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === brandImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? brandImages.length - 1 : prevIndex - 1
    );
  };

  // For desktop view
  const DesktopView = () => (
    <div className="flex justify-evenly items-center h-full">
      {brandImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className="w-auto h-8 md:h-12 lg:h-16 object-contain mx-2"
        />
      ))}
    </div>
  );

  // For mobile carousel view
  const MobileCarousel = () => (
    <div className="relative h-full flex flex-col justify-center">
      <div
        className="overflow-hidden relative h-16"
        ref={carouselRef}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {brandImages.map((image, index) => (
            <div
              key={index}
              className="min-w-full flex justify-center items-center"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-4">
        {brandImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-500"
              }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow navigation buttons */}
      <button
        className="absolute left-2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="absolute right-2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );

  return (
    <div className="bg-black p-5" style={{ minHeight: "120px" }}>
      {isMobile ? <MobileCarousel /> : <DesktopView />}
    </div>
  );
}

export default Brandadd;