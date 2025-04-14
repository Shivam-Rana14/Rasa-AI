import React, { useContext, useState, useEffect } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";
import { useTextToSpeech, SpeechButton } from "./TextToSpeech.jsx";
import OutfitImageModal from "./OutfitImageModal";
import ColorPreview from "./ColorPreview";
import { ColorService } from "../utils/ColorService";

const AnalysisResult = () => {
  const {
    previewUrl,
    preferences,
    analysisResult,
    outfitImages,
    fetchOutfitImage,
    setSelectedOutfitImage,
    accessoryImages,
    fetchAccessoryImage,
    setSelectedAccessoryImage,
  } = useContext(RasaAiCTX);
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [hoveredColor, setHoveredColor] = useState(null);
  const [colorHexMap, setColorHexMap] = useState({});

  // Fetch all colors when analysis result loads
  useEffect(() => {
    if (!analysisResult?.recommendations?.colorPalette) return;

    const allColors = [
      ...(analysisResult.recommendations.colorPalette.recommended || []),
      ...(analysisResult.recommendations.colorPalette.avoid || []),
      ...(analysisResult.recommendations.colorPalette.neutrals || []),
    ].map((color) =>
      typeof color === "string" ? color : color.name || "Color"
    );

    ColorService.fetchColorHexCodes(allColors).then((hexMap) =>
      setColorHexMap(hexMap)
    );
  }, [analysisResult]);

  // Handle outfit click
  const handleOutfitClick = (outfit) => {
    const outfitName =
      typeof outfit === "string" ? outfit : outfit.name || "Outfit";
    fetchOutfitImage(outfitName);

    // Show image immediately if we already have it
    if (outfitImages[outfitName]) {
      setSelectedOutfitImage(outfitImages[outfitName]);
    }
  };

  // Gender-specific styling for recommendations
  const genderStyles = {
    male: {
      color: "from-blue-500 to-blue-600",
      text: "text-blue-100",
      bg: "bg-blue-500/10",
    },
    female: {
      color: "from-pink-500 to-pink-600",
      text: "text-pink-100",
      bg: "bg-pink-500/10",
    },
  };

  const currentGenderStyle =
    genderStyles[preferences.gender] || genderStyles.male;

  // Speech content for each section
  const speechContent = {
    all: `Your style recommendations. Skin type: ${analysisResult.skinTone}. ${
      analysisResult.recommendations.colorPalette?.description ||
      "These colors will complement your natural undertones"
    }. Recommended colors: ${
      analysisResult.recommendations.colorPalette?.recommended?.join(", ") || ""
    }. Colors to avoid: ${
      analysisResult.recommendations.colorPalette?.avoid?.join(", ") || ""
    }. Best neutrals: ${
      analysisResult.recommendations.colorPalette?.neutrals?.join(", ") || ""
    }. Outfit suggestions: ${
      analysisResult.recommendations.outfits
        ?.map((o) => (typeof o === "string" ? o : o.name))
        .join(", ") || ""
    }. Accessories: ${
      analysisResult.recommendations.accessories
        ?.map((a) => (typeof a === "string" ? a : a.name))
        .join(", ") || ""
    }. Recommended fabrics: ${
      analysisResult.recommendations.seasonalTips?.fabrics?.join(", ") || ""
    }. Layering tips: ${
      analysisResult.recommendations.seasonalTips?.layers?.join(", ") || ""
    }`,

    colorPalette: `Color Palette. Recommended colors: ${
      analysisResult.recommendations.colorPalette?.recommended?.join(", ") || ""
    }. Colors to avoid: ${
      analysisResult.recommendations.colorPalette?.avoid?.join(", ") || ""
    }. Best neutrals: ${
      analysisResult.recommendations.colorPalette?.neutrals?.join(", ") || ""
    }`,

    outfits: `Outfit suggestions: ${
      analysisResult.recommendations.outfits
        ?.map((o) =>
          typeof o === "string"
            ? o
            : `${o.name || "Outfit"}. ${o.description || ""}`
        )
        .join(". ") || ""
    }`,

    accessories: `Accessories: ${
      analysisResult.recommendations.accessories
        ?.map((a) => (typeof a === "string" ? a : a.name))
        .join(", ") || ""
    }`,

    seasonalTips: `Seasonal Style Tips. Recommended fabrics: ${
      analysisResult.recommendations.seasonalTips?.fabrics?.join(", ") || ""
    }. Layering tips: ${
      analysisResult.recommendations.seasonalTips?.layers?.join(", ") || ""
    }`,

    bodyTypeTips: analysisResult.recommendations.bodyTypeTips
      ? `Body Type Recommendations. ${Object.entries(
          analysisResult.recommendations.bodyTypeTips
        )
          .map(
            ([category, items]) =>
              `${category}: ${items
                .map((i) =>
                  typeof i === "string"
                    ? i
                    : `${i.name || "Tip"}. ${i.description || ""}`
                )
                .join(". ")}`
          )
          .join(". ")}`
      : "",
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Outfit Image Modal */}
      <OutfitImageModal />

      {/* Image Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-n-6 to-n-7 aspect-[4/3]">
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 to-transparent" />
      </div>

      {analysisResult && (
        <div className="mt-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-3xl font-bold text-n-1">
              Your Style Recommendations
            </h3>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${currentGenderStyle.bg} ${currentGenderStyle.text}`}
              >
                {preferences.gender.charAt(0).toUpperCase() +
                  preferences.gender.slice(1)}
              </span>
              <SpeechButton
                text={speechContent.all}
                onSpeak={speak}
                onStop={stopSpeaking}
                isSpeaking={isSpeaking}
                className={currentGenderStyle.bg}
                label="Read all recommendations"
              />
            </div>
          </div>

          {/* Skin Type */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <h4 className="text-xl font-semibold text-n-1">Your Skin Type</h4>
            <div className="flex flex-col md:flex-row gap-6 mt-3">
              <div className="flex-1">
                <p className="text-lg font-medium text-color-1 mb-2">
                  {analysisResult.skinTone}
                </p>
                <p className="text-n-3">
                  {analysisResult.recommendations.colorPalette?.description ||
                    "These colors will complement your natural undertones"}
                </p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-n-1">Color Palette</h4>
              <SpeechButton
                text={speechContent.colorPalette}
                onSpeak={speak}
                onStop={stopSpeaking}
                isSpeaking={isSpeaking}
                className={currentGenderStyle.bg}
                label="Read color palette"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Recommended Colors */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentGenderStyle.color}`}
                  ></span>
                  Recommended Colors
                </h5>
                <div className="flex flex-wrap gap-2 relative">
                  {(
                    analysisResult.recommendations.colorPalette?.recommended ||
                    []
                  ).map((color, index) => {
                    const colorName =
                      typeof color === "string" ? color : color.name || "Color";
                    return (
                      <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => setHoveredColor(colorName)}
                        onMouseLeave={() => setHoveredColor(null)}
                      >
                        <span
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${currentGenderStyle.color} text-n-1 shadow-md cursor-pointer`}
                        >
                          {colorName}
                        </span>
                        {hoveredColor === colorName && (
                          <ColorPreview
                            colorName={colorName}
                            colorHex={colorHexMap[colorName]}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-n-5"></span>
                  Colors to Avoid
                </h5>
                <div className="flex flex-wrap gap-2 relative">
                  {(
                    analysisResult.recommendations.colorPalette?.avoid || []
                  ).map((color, index) => {
                    const colorName =
                      typeof color === "string" ? color : color.name || "Color";
                    return (
                      <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => setHoveredColor(colorName)}
                        onMouseLeave={() => setHoveredColor(null)}
                      >
                        <span className="px-3 py-1.5 bg-n-6 rounded-lg text-n-1 text-sm font-medium border border-n-5 shadow-sm cursor-pointer">
                          {colorName}
                        </span>
                        {hoveredColor === colorName && (
                          <ColorPreview
                            colorName={colorName}
                            colorHex={colorHexMap[colorName]}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Best Neutrals */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-n-4"></span>
                  Best Neutrals
                </h5>
                <div className="flex flex-wrap gap-2 relative">
                  {(
                    analysisResult.recommendations.colorPalette?.neutrals || []
                  ).map((color, index) => {
                    const colorName =
                      typeof color === "string" ? color : color.name || "Color";
                    return (
                      <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => setHoveredColor(colorName)}
                        onMouseLeave={() => setHoveredColor(null)}
                      >
                        <span className="px-3 py-1.5 bg-n-5 rounded-lg text-n-1 text-sm font-medium shadow-sm cursor-pointer">
                          {colorName}
                        </span>
                        {hoveredColor === colorName && (
                          <ColorPreview
                            colorName={colorName}
                            colorHex={colorHexMap[colorName]}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Outfit Recommendations */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-n-1">
                Outfit Suggestions
              </h4>
              <h5 className="text-sm font-semibold text-n-1">
                Click the outfit box to see the full look || Image Functionality
                is Experimental!
              </h5>

              <SpeechButton
                text={speechContent.outfits}
                onSpeak={speak}
                onStop={stopSpeaking}
                isSpeaking={isSpeaking}
                className={currentGenderStyle.bg}
                label="Read outfit suggestions"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {(analysisResult.recommendations.outfits || []).map(
                (item, index) => {
                  const outfitName =
                    typeof item === "string" ? item : item.name || "Outfit";
                  const hasImage = !!outfitImages[outfitName];

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${currentGenderStyle.bg} border-n-6 cursor-pointer transition-all active:scale-[0.98]`}
                      onClick={() => handleOutfitClick(item)}
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-n-1 mb-1">
                          {outfitName}
                        </h5>
                        {hasImage && (
                          <span className="text-n-3 text-xs flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                              <path d="M12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            </svg>
                            View
                          </span>
                        )}
                      </div>
                      {typeof item === "object" && item.description && (
                        <p className="text-sm text-n-3">{item.description}</p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Accessories */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-n-1">Accessories</h4>
              <h5 className="text-sm font-semibold text-n-1">
                Click the accessory box to see the full look || Image
                Functionality is Experimental!
              </h5>
              <SpeechButton
                text={speechContent.accessories}
                onSpeak={speak}
                onStop={stopSpeaking}
                isSpeaking={isSpeaking}
                className={currentGenderStyle.bg}
                label="Read accessories"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {(analysisResult.recommendations.accessories || []).map(
                (item, index) => {
                  const accessoryName =
                    typeof item === "string" ? item : item.name || "Accessory";
                  const hasImage = !!accessoryImages[accessoryName];

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${currentGenderStyle.bg} border border-n-6 cursor-pointer transition-all active:scale-[0.98]`}
                      onClick={() => {
                        fetchAccessoryImage(accessoryName);
                        if (accessoryImages[accessoryName]) {
                          setSelectedAccessoryImage(
                            accessoryImages[accessoryName]
                          );
                        }
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-n-1 font-medium text-center">
                          {accessoryName}
                        </span>
                        {hasImage && (
                          <span className="text-n-3 text-xs flex items-center gap-1 mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                              <path d="M12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            </svg>
                            View
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Seasonal Tips */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold text-n-1">
                Seasonal Style Tips
              </h4>
              <SpeechButton
                text={speechContent.seasonalTips}
                onSpeak={speak}
                onStop={stopSpeaking}
                isSpeaking={isSpeaking}
                className={currentGenderStyle.bg}
                label="Read seasonal tips"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h5 className="text-n-3 mb-3">Recommended Fabrics</h5>
                <div className="flex flex-wrap gap-2">
                  {(
                    analysisResult.recommendations.seasonalTips?.fabrics || []
                  ).map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-color-1 rounded-lg text-n-1 text-sm font-medium shadow-md"
                    >
                      {typeof item === "string" ? item : item.name || "Fabric"}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-n-3 mb-3">Layering Tips</h5>
                <div className="flex flex-wrap gap-2">
                  {(
                    analysisResult.recommendations.seasonalTips?.layers || []
                  ).map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-color-1 rounded-lg text-n-1 text-sm font-medium shadow-md"
                    >
                      {typeof item === "string" ? item : item.name || "Layer"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body Type Tips */}
          {analysisResult.recommendations.bodyTypeTips && (
            <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-xl font-semibold text-n-1">
                  Body Type Recommendations
                </h4>
                <SpeechButton
                  text={speechContent.bodyTypeTips}
                  onSpeak={speak}
                  onStop={stopSpeaking}
                  isSpeaking={isSpeaking}
                  className={currentGenderStyle.bg}
                  label="Read body type recommendations"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {Object.entries(
                  analysisResult.recommendations.bodyTypeTips
                ).map(([category, items]) => (
                  <div key={category}>
                    <h5 className="text-n-3 mb-3 capitalize">{category}</h5>
                    <div className="space-y-2">
                      {(items || []).map((item, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${currentGenderStyle.bg} border border-n-6`}
                        >
                          <p className="text-n-1">
                            {typeof item === "string"
                              ? item
                              : item.name || "Tip"}
                          </p>
                          {typeof item === "object" && item.description && (
                            <p className="text-sm text-n-3 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
