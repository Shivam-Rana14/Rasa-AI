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
                {genderOptions[preferences.gender].occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => handlePreferenceChange("occasion", occasion)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      preferences.occasion === occasion
                        ? "bg-color-1 text-n-1"
                        : "bg-n-5 text-n-3 hover:bg-n-4"
                    } transition-colors`}
                  >
                    {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                  </button>
                ))}
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

export default PreferencesForm;
