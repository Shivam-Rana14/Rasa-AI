import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import Button from "./Button";
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
} from "../constants";

const RasaAI = () => {
  const navigate = useNavigate();
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

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  // Start camera
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

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Capture photo
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

    // Simulate API call SKIN TONE 1-4
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
                onClick={() => {
                  handlePreferenceChange("gender", gender);
                  // Reset other preferences when gender changes
                  setPreferences((prev) => ({
                    ...prev,
                    gender,
                    occasion: "",
                    bodyType: "",
                    stylePreference: "",
                  }));
                }}
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
            <div className="flex flex-col">
              <label className="text-sm text-n-3 mb-1">Height (inches)</label>
              <input
                type="number"
                value={preferences.measurements.height}
                onChange={(e) =>
                  handlePreferenceChange("measurements.height", e.target.value)
                }
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-1 focus:outline-none focus:ring-2 focus:ring-color-1"
                min="0"
                step="1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-n-3 mb-1">Bust (inches)</label>
              <input
                type="number"
                value={preferences.measurements.bust}
                onChange={(e) =>
                  handlePreferenceChange("measurements.bust", e.target.value)
                }
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-1 focus:outline-none focus:ring-2 focus:ring-color-1"
                min="0"
                step="1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-n-3 mb-1">Waist (inches)</label>
              <input
                type="number"
                value={preferences.measurements.waist}
                onChange={(e) =>
                  handlePreferenceChange("measurements.waist", e.target.value)
                }
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-1 focus:outline-none focus:ring-2 focus:ring-color-1"
                min="0"
                step="1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-n-3 mb-1">Hips (inches)</label>
              <input
                type="number"
                value={preferences.measurements.hips}
                onChange={(e) =>
                  handlePreferenceChange("measurements.hips", e.target.value)
                }
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-1 focus:outline-none focus:ring-2 focus:ring-color-1"
                min="0"
                step="1"
              />
            </div>
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

  const getRecommendations = (skinTone) => {
    const outfits = getOutfitsForOccasion(
      preferences.occasion,
      skinTone,
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

    // Enhanced recommendations considering more factors
    const baseRecommendation = {
      colorPalette: getColorPaletteForSkinTone(skinTone),
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

    return baseRecommendation;
  };

  const getColorPaletteForSkinTone = (skinTone) => {
    return SKIN_TONE_PALETTES[skinTone] || SKIN_TONE_PALETTES[1];
  };

  const getOutfitsForOccasion = (occasion, gender, season, stylePreference) => {
    // First try exact match
    const exactMatch =
      OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[season];
    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, try to find a similar style
    const availableStyles = Object.keys(
      OUTFIT_RECOMMENDATIONS[gender]?.[occasion] || {}
    );
    if (availableStyles.length > 0) {
      // Try classic style first if available, otherwise use the first available style
      const fallbackStyle = availableStyles.includes("classic")
        ? "classic"
        : availableStyles[0];
      const fallbackRecommendations =
        OUTFIT_RECOMMENDATIONS[gender]?.[occasion]?.[fallbackStyle]?.[season];
      if (fallbackRecommendations) {
        return fallbackRecommendations;
      }
    }

    // If still no match, try to find any recommendations for this gender and occasion
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
    // First try exact match
    const exactMatch =
      ACCESSORY_RECOMMENDATIONS[gender]?.[occasion]?.[stylePreference]?.[
        season
      ];
    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, try to find a similar style
    const availableStyles = Object.keys(
      ACCESSORY_RECOMMENDATIONS[gender]?.[occasion] || {}
    );
    if (availableStyles.length > 0) {
      // Try classic style first if available, otherwise use the first available style
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

    // If still no match, provide default accessories based on gender and occasion
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

  return (
    <Section className="relative overflow-hidden">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <Button onClick={() => navigate("/")} className="min-w-[8rem]">
            Back Home
          </Button>
        </div>
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
