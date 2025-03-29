import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const PreferencesForm = () => {
  const {
    preferences,
    handlePreferenceChange,
    setShowPreferences,
    analyzeSkinTone,
  } = useContext(RasaAiCTX);

  // Gender-specific options
  const genderOptions = {
    male: {
      occasions: ["casual", "formal", "business", "party", "sports", "wedding"],
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
    <div className="w-full max-w-2xl p-8 rounded-2xl bg-n-7/80 backdrop-blur-sm border border-n-6 shadow-xl">
      <h3 className="text-3xl font-bold text-n-1 mb-8 bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
        Tell us about yourself
      </h3>

      <div className="space-y-8">
        {/* Gender Selection */}
        <div>
          <label className="block text-lg text-n-3 mb-4 font-medium">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(genderOptions).map((gender) => (
              <button
                key={gender}
                onClick={() => handlePreferenceChange("gender", gender)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  preferences.gender === gender
                    ? `bg-gradient-to-r ${
                        gender === "male"
                          ? "from-blue-500 to-blue-600"
                          : "from-pink-500 to-pink-600"
                      } text-n-1 shadow-md`
                    : "bg-n-6 text-n-3 hover:bg-n-5 border border-n-5"
                }`}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {preferences.gender && (
          <>
            {/* Occasion Selection */}
            <div>
              <label className="block text-lg text-n-3 mb-4 font-medium">
                Occasion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {genderOptions[preferences.gender].occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => handlePreferenceChange("occasion", occasion)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      preferences.occasion === occasion
                        ? "bg-gradient-to-r from-color-1 to-color-2 text-n-1 shadow-md"
                        : "bg-n-6 text-n-3 hover:bg-n-5 border border-n-5"
                    }`}
                  >
                    {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type Selection */}
            <div>
              <label className="block text-lg text-n-3 mb-4 font-medium">
                Body Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genderOptions[preferences.gender].bodyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handlePreferenceChange("bodyType", type)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      preferences.bodyType === type
                        ? "bg-gradient-to-r from-color-1 to-color-2 text-n-1 shadow-md"
                        : "bg-n-6 text-n-3 hover:bg-n-5 border border-n-5"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Preference Selection */}
            <div>
              <label className="block text-lg text-n-3 mb-4 font-medium">
                Style Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genderOptions[preferences.gender].stylePreferences.map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() =>
                        handlePreferenceChange("stylePreference", style)
                      }
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        preferences.stylePreference === style
                          ? "bg-gradient-to-r from-color-1 to-color-2 text-n-1 shadow-md"
                          : "bg-n-6 text-n-3 hover:bg-n-5 border border-n-5"
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* Season Selection */}
        <div>
          <label className="block text-lg text-n-3 mb-4 font-medium">
            Season
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["spring", "summer", "fall", "winter"].map((season) => (
              <button
                key={season}
                onClick={() => handlePreferenceChange("season", season)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  preferences.season === season
                    ? "bg-gradient-to-r from-color-1 to-color-2 text-n-1 shadow-md"
                    : "bg-n-6 text-n-3 hover:bg-n-5 border border-n-5"
                }`}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => setShowPreferences(false)}
            className="px-8 py-3.5 bg-n-6 rounded-xl text-n-1 font-medium hover:bg-n-5 transition-colors border border-n-5 shadow-sm"
          >
            Back
          </button>
          <button
            onClick={analyzeSkinTone}
            className={`px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg ${
              !preferences.occasion ||
              !preferences.bodyType ||
              !preferences.stylePreference ||
              !preferences.season ||
              !preferences.gender
                ? "bg-n-5 text-n-3 cursor-not-allowed"
                : "bg-gradient-to-r from-color-1 to-color-2 text-n-8 hover:opacity-90"
            }`}
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

export default PreferencesForm;
