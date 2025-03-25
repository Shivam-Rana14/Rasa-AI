import React, { useContext } from "react";
import Section from "./Section";
import { RasaAiCTX } from "../store/RasaAiContext";

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
    setShowPreferences,
    preferences,
    handlePreferenceChange,
    analyzeSkinTone,
  } = useContext(RasaAiCTX);

  const renderAnalysisResult = () => {
    // Gender-specific styling for recommendations
    const genderStyles = {
      male: {
        color: "bg-blue-500",
        text: "text-blue-100",
      },
      female: {
        color: "bg-pink-500",
        text: "text-pink-100",
      },
    };

    const currentGenderStyle =
      genderStyles[preferences.gender] || genderStyles.male;

    return (
      <div className="w-full max-w-[640px]">
        <div className="aspect-video rounded-lg overflow-hidden bg-n-6">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {analysisResult && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-n-1 mb-6">
              Your Style Recommendations
              <span className={`ml-2 text-sm ${currentGenderStyle.text}`}>
                (
                {preferences.gender.charAt(0).toUpperCase() +
                  preferences.gender.slice(1)}
                )
              </span>
            </h3>

            <div className="space-y-6">
              {/* Color Palette - same for both genders */}
              <div className="p-4 rounded-lg bg-n-5">
                <h4 className="text-n-1 font-semibold mb-2">
                  Your Skin Type: {analysisResult.skinTone}
                </h4>
                <p className="text-n-3 mb-4">
                  {analysisResult.recommendations.colorPalette?.description ||
                    "Recommended colors for your skin tone"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-n-3 mb-2">Recommended Colors</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        analysisResult.recommendations.colorPalette
                          ?.recommended || []
                      ).map((color, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                        >
                          {typeof color === "string"
                            ? color
                            : color.name || "Color"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-n-3 mb-2">Colors to Avoid</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        analysisResult.recommendations.colorPalette?.avoid || []
                      ).map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-n-6 rounded-lg text-n-1 text-sm"
                        >
                          {typeof color === "string"
                            ? color
                            : color.name || "Color"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-n-3 mb-2">Best Neutrals</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        analysisResult.recommendations.colorPalette?.neutrals ||
                        []
                      ).map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-n-4 rounded-lg text-n-1 text-sm"
                        >
                          {typeof color === "string"
                            ? color
                            : color.name || "Color"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender-specific recommendations */}
              {preferences.gender === "male" ? (
                <>
                  {/* Male-specific outfit recommendations */}
                  <div>
                    <h4 className="text-n-3 mb-2">Outfit Suggestions</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(analysisResult.recommendations.outfits || []).map(
                        (item, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                          >
                            {typeof item === "string"
                              ? item
                              : item.name || "Outfit"}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Male-specific accessories */}
                  <div>
                    <h4 className="text-n-3 mb-2">Accessories</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(analysisResult.recommendations.accessories || []).map(
                        (item, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                          >
                            {typeof item === "string"
                              ? item
                              : item.name || "Accessory"}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Female-specific outfit recommendations */}
                  <div>
                    <h4 className="text-n-3 mb-2">Outfit Suggestions</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(analysisResult.recommendations.outfits || []).map(
                        (item, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                          >
                            {typeof item === "string"
                              ? item
                              : item.name || "Outfit"}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Female-specific accessories */}
                  <div>
                    <h4 className="text-n-3 mb-2">Accessories</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(analysisResult.recommendations.accessories || []).map(
                        (item, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                          >
                            {typeof item === "string"
                              ? item
                              : item.name || "Accessory"}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Seasonal Tips (same for both genders) */}
              <div>
                <h4 className="text-n-3 mb-2">Seasonal Style Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-n-3 mb-2">Recommended Fabrics</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        analysisResult.recommendations.seasonalTips?.fabrics ||
                        []
                      ).map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {typeof item === "string"
                            ? item
                            : item.name || "Fabric"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-n-3 mb-2">Layering Tips</h5>
                    <div className="flex flex-wrap gap-2">
                      {(
                        analysisResult.recommendations.seasonalTips?.layers ||
                        []
                      ).map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {typeof item === "string"
                            ? item
                            : item.name || "Layer"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Type Tips */}
              <div>
                <h4 className="text-n-3 mb-2">Body Type Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.recommendations.bodyTypeTips &&
                    Object.entries(
                      analysisResult.recommendations.bodyTypeTips
                    ).map(([category, items]) => (
                      <div key={category}>
                        <h5 className="text-n-3 mb-2 capitalize">{category}</h5>
                        <div className="flex flex-wrap gap-2">
                          {(items || []).map((item, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-lg text-sm ${currentGenderStyle.color}`}
                            >
                              {typeof item === "string"
                                ? item
                                : item.name || "Tip"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreferencesForm = () => {
    // Gender-specific options
    const genderOptions = {
      male: {
        occasions: [
          "casual",
          "formal",
          "business",
          "party",
          "sports",
          "wedding",
        ],
        bodyTypes: [
          "athletic",
          "ectomorph",
          "mesomorph",
          "endomorph",
          "rectangle",
        ],
        stylePreferences: [
          "classic",
          "modern",
          "minimalist",
          "streetwear",
          "business",
        ],
      },
      female: {
        occasions: [
          "casual",
          "formal",
          "business",
          "party",
          "cocktail",
          "wedding",
          "brunch",
        ],
        bodyTypes: [
          "hourglass",
          "pear",
          "apple",
          "rectangle",
          "inverted triangle",
        ],
        stylePreferences: [
          "classic",
          "bohemian",
          "minimalist",
          "romantic",
          "chic",
        ],
      },
    };

    return (
      <div className="w-full max-w-[640px] p-6 rounded-xl bg-n-6">
        <h3 className="text-2xl font-bold text-n-1 mb-6">
          Tell us about yourself
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-n-3 mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(genderOptions).map((gender) => (
                <button
                  key={gender}
                  onClick={() => handlePreferenceChange("gender", gender)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    preferences.gender === gender
                      ? "bg-color-1 text-n-1"
                      : "bg-n-5 text-n-3 hover:bg-n-4"
                  } transition-colors`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {preferences.gender && (
            <>
              <div>
                <label className="block text-n-3 mb-2">Occasion</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genderOptions[preferences.gender].occasions.map(
                    (occasion) => (
                      <button
                        key={occasion}
                        onClick={() =>
                          handlePreferenceChange("occasion", occasion)
                        }
                        className={`px-4 py-2 rounded-lg text-sm ${
                          preferences.occasion === occasion
                            ? "bg-color-1 text-n-1"
                            : "bg-n-5 text-n-3 hover:bg-n-4"
                        } transition-colors`}
                      >
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-n-3 mb-2">Body Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genderOptions[preferences.gender].bodyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePreferenceChange("bodyType", type)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        preferences.bodyType === type
                          ? "bg-color-1 text-n-1"
                          : "bg-n-5 text-n-3 hover:bg-n-4"
                      } transition-colors`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-n-3 mb-2">Style Preference</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genderOptions[preferences.gender].stylePreferences.map(
                    (style) => (
                      <button
                        key={style}
                        onClick={() =>
                          handlePreferenceChange("stylePreference", style)
                        }
                        className={`px-4 py-2 rounded-lg text-sm ${
                          preferences.stylePreference === style
                            ? "bg-color-1 text-n-1"
                            : "bg-n-5 text-n-3 hover:bg-n-4"
                        } transition-colors`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          {/* Season selection (same for both genders) */}
          <div>
            <label className="block text-n-3 mb-2">Season</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["spring", "summer", "fall", "winter"].map((season) => (
                <button
                  key={season}
                  onClick={() => handlePreferenceChange("season", season)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    preferences.season === season
                      ? "bg-color-1 text-n-1"
                      : "bg-n-5 text-n-3 hover:bg-n-4"
                  } transition-colors`}
                >
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => setShowPreferences(false)}
              className="px-6 py-3 bg-n-5 rounded-xl text-n-1 hover:bg-n-4 transition-colors"
            >
              Back
            </button>
            <button
              onClick={analyzeSkinTone}
              className="px-6 py-3 bg-color-1 rounded-xl text-n-1 hover:bg-color-1/90 transition-colors"
              disabled={
                !preferences.occasion ||
                !preferences.bodyType ||
                !preferences.stylePreference ||
                !preferences.season ||
                !preferences.gender
              }
            >
              Get Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  };

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
