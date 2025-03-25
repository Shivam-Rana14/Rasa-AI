import React, { useContext } from "react";
import { RasaAiCTX } from "../store/RasaAiContext";

const AnalysisResult = () => {
  const { previewUrl, preferences, analysisResult } = useContext(RasaAiCTX);

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
                      analysisResult.recommendations.seasonalTips?.fabrics || []
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
                      analysisResult.recommendations.seasonalTips?.layers || []
                    ).map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                      >
                        {typeof item === "string" ? item : item.name || "Layer"}
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

export default AnalysisResult;
