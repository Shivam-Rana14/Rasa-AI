import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const OutfitImageModal = () => {
  const {
    selectedOutfitImage,
    setSelectedOutfitImage,
    selectedAccessoryImage,
    setSelectedAccessoryImage,
  } = useContext(RasaAiCTX);

  const imageToShow = selectedOutfitImage || selectedAccessoryImage;
  const isAccessory = !!selectedAccessoryImage;

  if (!imageToShow) return null;

  const closeModal = () => {
    if (isAccessory) {
      setSelectedAccessoryImage(null);
    } else {
      setSelectedOutfitImage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-n-8/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute -top-10 right-0 p-2 text-n-1 hover:text-color-1 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="overflow-hidden rounded-2xl bg-n-7 border border-n-6 shadow-xl">
          <img
            src={imageToShow}
            alt={isAccessory ? "Accessory visual" : "Outfit visual"}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <div className="p-4 text-center text-n-3">
            {isAccessory ? "Accessory Preview" : "Outfit Preview"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitImageModal;
