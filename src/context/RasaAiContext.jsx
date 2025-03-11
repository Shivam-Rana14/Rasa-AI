import { createContext } from "react";

import React, { useState, useRef } from "react";

import {
  DEFAULT_MEASUREMENTS,
  OCCASIONS,
  BODY_TYPES,
  STYLE_PREFERENCES,
  SEASONS,
  SKIN_TONE_PALETTES,
  OUTFIT_RECOMMENDATIONS,
  ACCESSORY_RECOMMENDATIONS,
  styles,
} from "../constants/index";
import { set } from "mongoose";

export const RasaAiCTX = createContext({
  image: null,
  previewUrl: null,
  isAnalyzing: false,
  showCamera: false,
  error: null,
  showPreferences: false,
  preferences: {
    gender: "",
    occasion: "",
    bodyType: "",
    stylePreference: "",
    season: "",
    measurements: { ...DEFAULT_MEASUREMENTS },
  },
  analysisResult: null,
  videoRef: null,
  fileInputRef: null,
  handlePreferenceChange: () => {},
  handleFileUpload: () => {},
  startCamera: () => {},
  stopCamera: () => {},
  capturePhoto: () => {},
  analyzeSkinTone: () => {},
  resetAll: () => {},
  getBodyTypeSpecificStyles: () => {},
  getSeasonalAdjustments: () => {},
  getOutfitsForOccasion: () => {},
  getAccessories: () => {},
  getRecommendations: () => {},
  renderPreferencesForm: () => {},
  renderAnalysisResult: () => {},
  setShowPreferences: () => {},
});

export default function RasaAiContextProvider({ children }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    gender: "",
    occasion: "",
    bodyType: "",
    stylePreference: "",
    season: "",
    measurements: { ...DEFAULT_MEASUREMENTS },
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handlePreferenceChange = (key, value) => {
    if (key.includes("measurements.")) {
      const measurementKey = key.split(".")[1];
      setPreferences((prev) => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementKey]: value,
        },
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setShowCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

        setImage(file);
        setPreviewUrl(url);
        stopCamera();
        setError(null);
      }, "image/jpeg");
    } catch (err) {
      setError("Failed to capture photo. Please try again.");
    }
  };

  const analyzeSkinTone = async () => {
    if (
      !image ||
      !preferences.occasion ||
      !preferences.bodyType ||
      !preferences.stylePreference ||
      !preferences.season ||
      !preferences.gender
    ) {
      setError("Please fill in all preferences before analyzing");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // Simulate API call for skin tone (1-4)
    setTimeout(() => {
      const mockSkinTone = Math.floor(Math.random() * 4) + 1;
      const recommendations = getRecommendations(mockSkinTone);

      setAnalysisResult({
        skinTone: mockSkinTone,
        preferences: { ...preferences },
        recommendations,
      });

      setIsAnalyzing(false);
      setShowPreferences(false);
    }, 2000);
  };

  const resetAll = () => {
    stopCamera();
    setImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setShowPreferences(false);
    setPreferences({
      gender: "",
      occasion: "",
      bodyType: "",
      stylePreference: "",
      season: "",
      measurements: { ...DEFAULT_MEASUREMENTS },
    });
  };

  const getBodyTypeSpecificStyles = (bodyType, gender) => {
    return (
      styles[gender]?.[bodyType] ||
      styles[gender]?.athletic ||
      styles.female.athletic
    );
  };

  const getSeasonalAdjustments = (season) => {
    const adjustments = {
      spring: {
        fabrics: ["Light cotton", "Linen blends", "Light denim"],
        layers: ["Light cardigans", "Denim jackets", "Light blazers"],
        colors: ["Pastels", "Light neutrals", "Soft brights"],
      },
      summer: {
        fabrics: ["Lightweight cotton", "Linen", "Breathable synthetics"],
        layers: ["Kimonos", "Light shawls", "Sun protection layers"],
        colors: ["Bright colors", "Whites", "Light neutrals"],
      },
      fall: {
        fabrics: ["Wool", "Cotton blend", "Leather"],
        layers: ["Cardigans", "Blazers", "Coats"],
        colors: ["Earth tones", "Rich jewel tones", "Deep neutrals"],
      },
      winter: {
        fabrics: ["Heavy wool", "Cashmere", "Fleece"],
        layers: ["Coats", "Parkas", "Thermal layers"],
        colors: ["Dark neutrals", "Rich jewel tones", "Deep berry shades"],
      },
    };

    return adjustments[season] || {};
  };

  const getOutfitsForOccasion = (occasion, gender, season, stylePreference) => {
    // Try exact match first
    const exactMatch =
      OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[season];
    if (exactMatch) {
      return exactMatch;
    }

    // Fallback 1: Try any style preference for the same occasion and season
    const availableStyles = Object.keys(
      OUTFIT_RECOMMENDATIONS[gender]?.[occasion] || {}
    );
    if (availableStyles.length > 0) {
      const fallbackStyle = availableStyles.includes("classic")
        ? "classic"
        : availableStyles[0];
      const fallbackRecommendations =
        OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[fallbackStyle]?.[season];
      if (fallbackRecommendations) {
        return fallbackRecommendations;
      }
    }

    // Fallback 2: Try any season for the same occasion and style preference
    const availableSeasons = Object.keys(
      OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference] || {}
    );
    if (availableSeasons.length > 0) {
      const fallbackSeason = availableSeasons[0];
      const fallbackRecommendations =
        OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[
          fallbackSeason
        ];
      if (fallbackRecommendations) {
        return fallbackRecommendations;
      }
    }

    // Fallback 3: Default recommendations for the occasion and gender
    const defaultOutfits = {
      male: {
        casual: [
          "Classic t-shirt with jeans",
          "Polo shirt with chinos",
          "Button-down shirt with dark pants",
        ],
        formal: [
          "Navy suit with white shirt",
          "Charcoal suit with light blue shirt",
          "Black suit with crisp white shirt",
        ],
        business: [
          "Navy blazer with gray trousers",
          "Gray suit with white shirt",
          "Charcoal suit with light shirt",
        ],
        party: [
          "Dark jeans with dress shirt",
          "Blazer with dark jeans",
          "Dress pants with fitted shirt",
        ],
        sports: [
          "Athletic shirt with track pants",
          "Performance polo with shorts",
          "Training jacket with matching pants",
        ],
        wedding: [
          "Classic black suit",
          "Navy suit with tie",
          "Gray suit with formal shirt",
        ],
      },
      female: {
        casual: ["Jeans with blouse", "Casual dress", "Sweater with leggings"],
        formal: ["Little black dress", "Formal pantsuit", "Evening gown"],
        business: [
          "Blazer with pencil skirt",
          "Professional pantsuit",
          "Blouse with tailored pants",
        ],
        party: ["Cocktail dress", "Stylish jumpsuit", "Statement dress"],
        cocktail: [
          "Knee-length cocktail dress",
          "Elegant jumpsuit",
          "Chic evening dress",
        ],
        wedding: ["Formal gown", "Elegant dress", "Sophisticated evening wear"],
        brunch: ["Sundress", "Blouse with skirt", "Casual dress"],
      },
    };

    return (
      defaultOutfits[gender]?.[occasion] || [
        "Classic pieces suitable for any occasion",
      ]
    );
  };

  const getAccessories = (stylePreference, occasion, gender, season) => {
    // Try exact match first
    const exactMatch =
      ACCESSORY_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[
        season
      ];
    if (exactMatch) {
      return exactMatch;
    }

    // Fallback 1: Try any style preference for the same occasion and season
    const availableStyles = Object.keys(
      ACCESSORY_RECOMMENDATIONS[gender]?.[occasion] || {}
    );
    if (availableStyles.length > 0) {
      const fallbackStyle = availableStyles.includes("classic")
        ? "classic"
        : availableStyles[0];
      const fallbackRecommendations =
        ACCESSORY_RECOMMENDATIONS[gender]?.[occasion]?.[fallbackStyle]?.[
          season
        ];
      if (fallbackRecommendations) {
        return fallbackRecommendations;
      }
    }

    // Fallback 2: Try any season for the same occasion and style preference
    const availableSeasons = Object.keys(
      ACCESSORY_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference] || {}
    );
    if (availableSeasons.length > 0) {
      const fallbackSeason = availableSeasons[0];
      const fallbackRecommendations =
        ACCESSORY_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[
          fallbackSeason
        ];
      if (fallbackRecommendations) {
        return fallbackRecommendations;
      }
    }

    // Fallback 3: Default accessories for the occasion and gender
    const defaultAccessories = {
      male: {
        casual: ["Classic watch", "Leather belt", "Sunglasses"],
        formal: ["Dress watch", "Tie", "Cufflinks"],
        business: ["Professional watch", "Leather belt", "Tie clip"],
        party: ["Fashion watch", "Statement belt", "Pocket square"],
        sports: ["Sports watch", "Athletic socks", "Headband"],
        wedding: ["Formal watch", "Silk tie", "Dress shoes"],
      },
      female: {
        casual: ["Simple necklace", "Stud earrings", "Classic watch"],
        formal: ["Statement necklace", "Elegant earrings", "Evening clutch"],
        business: ["Pearl earrings", "Delicate necklace", "Professional watch"],
        party: ["Statement jewelry", "Evening bag", "Fashion heels"],
        cocktail: ["Crystal earrings", "Evening clutch", "Statement bracelet"],
        wedding: ["Fine jewelry set", "Evening bag", "Hair accessories"],
        brunch: ["Delicate jewelry", "Sunglasses", "Fashion watch"],
      },
    };

    return (
      defaultAccessories[gender]?.[occasion] || [
        "Classic accessories that complement any outfit",
      ]
    );
  };

  const getRecommendations = (skinTone) => {
    const outfits = getOutfitsForOccasion(
      preferences.occasion,
      preferences.gender,
      preferences.season,
      preferences.stylePreference
    );
    const accessories = getAccessories(
      preferences.stylePreference,
      preferences.occasion,
      preferences.gender,
      preferences.season
    );

    return {
      colorPalette: SKIN_TONE_PALETTES[skinTone] || SKIN_TONE_PALETTES[1],
      outfits: Array.isArray(outfits)
        ? outfits
        : ["Classic pieces suitable for any occasion"],
      accessories: Array.isArray(accessories)
        ? accessories
        : ["Classic accessories that complement any outfit"],
      seasonal: getSeasonalAdjustments(preferences.season),
      bodyTypeRecommendations: getBodyTypeSpecificStyles(
        preferences.bodyType,
        preferences.gender
      ),
    };
  };

  const renderPreferencesForm = () => (
    <div className="w-full max-w-[640px] p-6 rounded-xl bg-n-6">
      <h3 className="text-2xl font-bold text-n-1 mb-6">
        Tell us about yourself
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-n-3 mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            {["male", "female"].map((gender) => (
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
                {OCCASIONS[preferences.gender].map((occasion) => (
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
                {BODY_TYPES[preferences.gender].map((type) => (
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
                {STYLE_PREFERENCES[preferences.gender].map((style) => (
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
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-n-3 mb-2">Season</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEASONS.map((season) => (
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

        <div>
          <label className="block text-n-3 mb-2">Measurements</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(preferences.measurements).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-n-3 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)} (inches)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handlePreferenceChange(
                      `measurements.${key}`,
                      e.target.value
                    )
                  }
                  className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-1 focus:outline-none focus:ring-2 focus:ring-color-1"
                  min="0"
                  step="1"
                />
              </div>
            ))}
          </div>
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
  );

  const renderAnalysisResult = () => (
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
          </h3>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-n-5">
              <h4 className="text-n-1 font-semibold mb-2">
                Your Skin Type: {analysisResult.skinTone}
              </h4>
              <p className="text-n-3 mb-4">
                {analysisResult.recommendations.colorPalette.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="text-n-3 mb-2">Recommended Colors</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.recommended.map(
                      (color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-n-3 mb-2">Colors to Avoid</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.avoid.map(
                      (color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-n-6 rounded-lg text-n-1 text-sm"
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-n-3 mb-2">Best Neutrals</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.neutrals.map(
                      (color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-n-4 rounded-lg text-n-1 text-sm"
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Recommended Outfits</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysisResult.recommendations.outfits.map((outfit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                  >
                    {outfit}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Accessories</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysisResult.recommendations.accessories.map(
                  (accessory, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                    >
                      {accessory}
                    </span>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Seasonal Style Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-n-3 mb-2">Recommended Fabrics</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.seasonal.fabrics.map(
                      (fabric, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {fabric}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="text-n-3 mb-2">Layering Tips</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.seasonal.layers.map(
                      (layer, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {layer}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Body Type Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(
                  analysisResult.recommendations.bodyTypeRecommendations
                ).map(([category, items]) => (
                  <div key={category}>
                    <h5 className="text-n-3 mb-2 capitalize">{category}</h5>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                        >
                          {item}
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
  const RasaAiContext = {
    image: image,
    previewUrl: previewUrl,
    isAnalyzing: isAnalyzing,
    showCamera: showCamera,
    error: error,
    showPreferences: showPreferences,
    preferences: preferences,
    analysisResult: analysisResult,
    videoRef: videoRef,
    fileInputRef: fileInputRef,
    handlePreferenceChange: handlePreferenceChange,
    handleFileUpload: handleFileUpload,
    startCamera: startCamera,
    stopCamera: stopCamera,
    capturePhoto: capturePhoto,
    analyzeSkinTone: analyzeSkinTone,
    resetAll: resetAll,
    getBodyTypeSpecificStyles: getBodyTypeSpecificStyles,
    getSeasonalAdjustments: getSeasonalAdjustments,
    getOutfitsForOccasion: getOutfitsForOccasion,
    getAccessories: getAccessories,
    getRecommendations: getRecommendations,
    renderPreferencesForm: renderPreferencesForm,
    renderAnalysisResult: renderAnalysisResult,
    setShowPreferences: setShowPreferences,
  };
  return (
    <RasaAiCTX.Provider value={RasaAiContext}>{children}</RasaAiCTX.Provider>
  );
}
