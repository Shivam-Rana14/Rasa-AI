import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const CameraInterface = () => {
  const { videoRef, capturePhoto, stopCamera } = useContext(RasaAiCTX);

  return (
    <div className="relative w-full max-w-[640px] aspect-video rounded-lg overflow-hidden bg-n-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onCanPlay={(e) => {
          e.target.play();
        }}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
        <button
          onClick={capturePhoto}
          className="px-6 py-3 bg-color-1 rounded-xl text-n-1 hover:bg-color-1/90 transition-colors"
        >
          Capture Photo
        </button>
        <button
          onClick={stopCamera}
          className="px-6 py-3 bg-n-5 rounded-xl text-n-1 hover:bg-n-4 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraInterface;
