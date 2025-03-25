import React, { useContext } from "react";
import Section from "./Section";
import { RasaAiCTX } from "../store/RasaAiContext";
import AnalysisResult from "./AnalysisResult";
import PreferencesForm from "./PreferencesForm";
import CameraInterface from "./CameraInterface";
import ImageUpload from "./ImageUpload";

const RasaAI = () => {
  const {
    previewUrl,
    isAnalyzing,
    showCamera,
    error,
    showPreferences,
    analysisResult,
    resetAll,
    setShowPreferences,
  } = useContext(RasaAiCTX);

  return (
    <Section className="relative min-h-[calc(100vh-80px)] flex items-center py-12">
      <div className="container h-full">
        <div className="flex flex-col h-full">
          {/* Heading */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-n-1 bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
              Skin Tone Analysis
            </h1>
            <p className="mx-auto mt-4 text-lg text-n-3 max-w-2xl">
              Get personalized color and outfit recommendations based on your
              skin tone and preferences
            </p>
          </div>

          {/* Main content */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-n-7/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 border border-n-6 shadow-xl">
              {error && (
                <div className="w-full p-4 mb-6 rounded-xl bg-[#ff666626] border border-[#ff6666] text-[#ff6666] text-center animate-fade-in">
                  {error}
                </div>
              )}

              <div className="flex flex-col items-center">
                {showCamera ? (
                  <CameraInterface />
                ) : showPreferences ? (
                  <PreferencesForm />
                ) : previewUrl ? (
                  analysisResult ? (
                    <AnalysisResult />
                  ) : (
                    <div className="w-full">
                      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-n-6 to-n-7 aspect-[4/3] max-w-3xl mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 to-transparent" />
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                          onClick={() => setShowPreferences(true)}
                          className="px-8 py-3.5 bg-gradient-to-r from-color-1 to-color-2 rounded-xl text-n-8 font-medium hover:opacity-90 transition-opacity shadow-lg"
                        >
                          Continue
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-8 py-3.5 bg-n-6 rounded-xl text-n-1 font-medium hover:bg-n-5 transition-colors border border-n-5"
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <ImageUpload />
                )}

                {isAnalyzing && (
                  <div className="text-center text-n-3 my-8 space-y-2 animate-pulse">
                    <p className="text-xl font-medium">
                      Analyzing your skin tone...
                    </p>
                    <p>Generating personalized recommendations just for you</p>
                    <div className="mt-4 flex justify-center">
                      <div className="h-2 w-48 bg-n-6 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-color-1 to-color-2 animate-progress" />
                      </div>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <button
                    onClick={resetAll}
                    className="mt-8 px-8 py-3.5 bg-n-6 rounded-xl text-n-1 font-medium hover:bg-n-5 transition-colors border border-n-5 shadow-sm"
                  >
                    Start New Analysis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default RasaAI;
