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
                  <CameraInterface />
                ) : showPreferences ? (
                  <PreferencesForm />
                ) : previewUrl ? (
                  analysisResult ? (
                    <AnalysisResult />
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
                  <ImageUpload />
                )}

                {isAnalyzing && (
                  <div className="text-center text-n-3">
                    <p>Analyzing your skin tone and preferences...</p>
                    <p>
                      This may take a moment as we generate personalized
                      recommendations.
                    </p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default RasaAI;
