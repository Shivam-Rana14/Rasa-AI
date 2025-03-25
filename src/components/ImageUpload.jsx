import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const ImageUpload = () => {
  const { fileInputRef, handleFileUpload, startCamera } = useContext(RasaAiCTX);

  return (
    <>
      <div className="w-full max-w-[640px] aspect-video rounded-lg bg-n-6 border-2 border-dashed border-n-4 flex flex-col items-center justify-center p-4">
        <p className="text-n-3 text-center mb-2">No image selected</p>
        <p className="text-n-4 text-sm text-center">
          Use the buttons below to capture or upload a photo
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={startCamera}
          className="px-6 py-3 bg-color-1 rounded-xl text-n-1 hover:bg-color-1/90 transition-colors"
        >
          Open Camera
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-n-5 rounded-xl text-n-1 hover:bg-n-4 transition-colors"
        >
          Upload Photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </>
  );
};

export default ImageUpload;
