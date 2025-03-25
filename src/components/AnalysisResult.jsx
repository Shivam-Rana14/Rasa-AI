import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const AnalysisResult = () => {
  const { previewUrl, preferences, analysisResult } = useContext(RasaAiCTX);

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

  return (
    <div className="w-full max-w-4xl">
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
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${currentGenderStyle.bg} ${currentGenderStyle.text}`}
            >
              {preferences.gender.charAt(0).toUpperCase() +
                preferences.gender.slice(1)}
            </span>
          </div>

          {/* Skin Type */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <h4 className="text-xl font-semibold text-n-1 mb-3">
              Your Skin Type
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
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
            <h4 className="text-xl font-semibold text-n-1 mb-4">
              Color Palette
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recommended Colors */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentGenderStyle.color}`}
                  ></span>
                  Recommended Colors
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(
                    analysisResult.recommendations.colorPalette?.recommended ||
                    []
                  ).map((color, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${currentGenderStyle.color} text-n-1 shadow-md`}
                    >
                      {typeof color === "string"
                        ? color
                        : color.name || "Color"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-n-5"></span>
                  Colors to Avoid
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(
                    analysisResult.recommendations.colorPalette?.avoid || []
                  ).map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-n-6 rounded-lg text-n-1 text-sm font-medium border border-n-5 shadow-sm"
                    >
                      {typeof color === "string"
                        ? color
                        : color.name || "Color"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Neutrals */}
              <div>
                <h5 className="text-n-3 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-n-4"></span>
                  Best Neutrals
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(
                    analysisResult.recommendations.colorPalette?.neutrals || []
                  ).map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-n-5 rounded-lg text-n-1 text-sm font-medium shadow-sm"
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

          {/* Outfit Recommendations */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <h4 className="text-xl font-semibold text-n-1 mb-4">
              Outfit Suggestions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(analysisResult.recommendations.outfits || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${currentGenderStyle.bg} border-n-6`}
                  >
                    <h5 className="font-medium text-n-1 mb-1">
                      {typeof item === "string" ? item : item.name || "Outfit"}
                    </h5>
                    {typeof item === "object" && item.description && (
                      <p className="text-sm text-n-3">{item.description}</p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Accessories */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <h4 className="text-xl font-semibold text-n-1 mb-4">Accessories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(analysisResult.recommendations.accessories || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${currentGenderStyle.bg} border border-n-6 flex items-center justify-center`}
                  >
                    <span className="text-n-1 font-medium text-center">
                      {typeof item === "string"
                        ? item
                        : item.name || "Accessory"}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Seasonal Tips */}
          <div className="p-6 rounded-2xl bg-n-7 border border-n-6 shadow-lg">
            <h4 className="text-xl font-semibold text-n-1 mb-4">
              Seasonal Style Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h4 className="text-xl font-semibold text-n-1 mb-4">
                Body Type Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
