import React, { useContext } from "react";
import Section from "./Section";
import Button from "./Button";
import { RasaAiCTX } from "../context/RasaAiContext";
import { useNavigate } from "react-router-dom";

const RasaAI = () => {
  const {
    previewUrl,
    isAnalyzing,
    showCamera,
    error,
    showPreferences,
    analysisResult,
    videoRef,
    fileInputRef,
    handleFileUpload,
    startCamera,
    stopCamera,
    capturePhoto,
    resetAll,
    renderPreferencesForm,
    renderAnalysisResult,
    setShowPreferences,
  } = useContext(RasaAiCTX);

  return (
    <Section className="relative overflow-hidden">
      <div className="container">
        <div className="flex justify-between items-center mb-10"></div>
        <div className="relative">
          <div className="text-center">
            <h1 className="mb-6 text-5xl lg:text-7xl font-bold text-n-1">
              Skin Tone Analysis
            </h1>
            <p className="mx-auto mb-8 max-w-[800px] text-n-3">
              Get personalized color and outfit recommendations based on your
              skin tone and preferences
            </p>
          </div>

          <div className="mx-auto max-w-[800px]">
            <div className="mb-10 rounded-2xl bg-n-7 p-8">
              <div className="flex flex-col items-center gap-6">
                {error && (
                  <div className="w-full p-4 rounded-lg bg-[#ff666626] border border-[#ff6666] text-[#ff6666]">
                    {error}
                  </div>
                )}

                {showCamera ? (
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
                ) : showPreferences ? (
                  renderPreferencesForm()
                ) : previewUrl ? (
                  analysisResult ? (
                    renderAnalysisResult()
                  ) : (
                    <div className="w-full max-w-[640px]">
                      <div className="aspect-video rounded-lg overflow-hidden bg-n-6">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-6 flex justify-center gap-4">
                        <button
                          onClick={() => setShowPreferences(true)}
                          className="px-6 py-3 bg-color-1 rounded-xl text-n-1 hover:bg-color-1/90 transition-colors"
                        >
                          Continue
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-6 py-3 bg-n-5 rounded-xl text-n-1 hover:bg-n-4 transition-colors"
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full max-w-[640px] aspect-video rounded-lg bg-n-6 border-2 border-dashed border-n-4 flex flex-col items-center justify-center p-4">
                    <p className="text-n-3 text-center mb-2">
                      No image selected
                    </p>
                    <p className="text-n-4 text-sm text-center">
                      Use the buttons below to capture or upload a photo
                    </p>
                  </div>
                )}

                {!showCamera && !showPreferences && !analysisResult && (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {!previewUrl && (
                      <>
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
                      </>
                    )}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center text-n-3">
                    <p>Analyzing your skin tone and preferences...</p>
                  </div>
                )}

                {analysisResult && (
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 bg-n-5 rounded-xl text-n-1 hover:bg-n-4 transition-colors"
                  >
                    Start Over
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default RasaAI;
