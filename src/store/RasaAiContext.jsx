import { createContext, useState, useRef } from "react";

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
    measurements: {},
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
  setShowPreferences: () => {},
  outfitImages: {},
  fetchOutfitImage: () => {},
  selectedOutfitImage: null,
  setSelectedOutfitImage: () => {},
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
    measurements: {},
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [outfitImages, setOutfitImages] = useState({});
  const [selectedOutfitImage, setSelectedOutfitImage] = useState(null);

  const fetchOutfitImage = async (outfitName) => {
    // Check if we already have this image cached
    if (outfitImages[outfitName]) return;

    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    if (!apiKey) {
      console.error("Pexels API key not found");
      return;
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          outfitName
        )}&per_page=1`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Pexels API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setOutfitImages((prev) => ({
          ...prev,
          [outfitName]: data.photos[0].src.medium,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch outfit image:", err);
    }
  };

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

    try {
      // Simulate skin tone analysis (1-4)
      const skinTone = Math.floor(Math.random() * 4) + 1;

      // Generate prompt for Gemini API
      const prompt = generateGeminiPrompt(skinTone, preferences);

      // Call Gemini API
      const recommendations = await getGeminiRecommendations(prompt);

      setAnalysisResult({
        skinTone,
        preferences: { ...preferences },
        recommendations,
      });
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
      console.error("Gemini API error:", err);
    } finally {
      setIsAnalyzing(false);
      setShowPreferences(false);
    }
  };

  const generateGeminiPrompt = (skinTone, preferences) => {
    return `Act as a professional fashion stylist and provide concise fashion recommendations in this exact JSON format:
    {
      "colorPalette": {
        "description": "Brief color palette recommendations.",
        "recommended": ["Color1", "Color2", "Color3", "Color4", "Color5", "Color6"],
        "avoid": ["Color7", "Color8", "Color9"],
        "neutrals": ["Neutral1", "Neutral2", "Neutral3"]
      },
      "outfits": [
        "Outfit suggestion 1",
        "Outfit suggestion 2",
        "Outfit suggestion 3",
        "Outfit suggestion 4"
      ],
      "accessories": [
        "Accessories for outfit 1",
        "Accessories for outfit 2",
        "Accessories for outfit 3",
        "Accessories for outfit 4"
      ],
      "seasonalTips": {
        "fabrics": ["Fabric 1", "Fabric 2", "Fabric 3"],
        "layers": ["Layering tip 1", "Layering tip 2"],
        "colors": ["Seasonal color 1", "Seasonal color 2", "Seasonal color 3"]
      },
      "bodyTypeTips": {
        "tops": ["Top tip 1", "Top tip 2"],
        "bottoms": ["Bottom tip 1", "Bottom tip 2"],
        "dresses": ["Dress tip 1", "Dress tip 2"],
        "general": ["General tip 1", "General tip 2"]
      }
    }
  
    Provide short, to-the-point suggestions. Ensure the 'accessories' array provides combinations that directly complement each of the 'outfits' in the order they are listed. Give optimal and relevant body type recommendations. Provide appropriate seasonal tips.
  
    Based on:
    - Skin tone: ${skinTone}
    - Gender: ${preferences.gender}
    - Occasion: ${preferences.occasion}
    - Body type: ${preferences.bodyType}
    - Style preference: ${preferences.stylePreference}
    - Season: ${preferences.season}`;
  };

  const getGeminiRecommendations = async (prompt) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API service unavailable");
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Extract the text content from the response
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        throw new Error("No valid response from Gemini API");
      }

      // Parse the JSON string response into an object
      try {
        const jsonStart = textContent.indexOf("{");
        const jsonEnd = textContent.lastIndexOf("}") + 1;
        const jsonString = textContent.slice(jsonStart, jsonEnd);
        const parsedResponse = JSON.parse(jsonString);

        // Transform the response into the expected format
        return {
          colorPalette: {
            description:
              parsedResponse.colorPalette?.description ||
              "Recommended colors for your skin tone",
            recommended: parsedResponse.colorPalette?.recommended || [],
            avoid: parsedResponse.colorPalette?.avoid || [],
            neutrals: parsedResponse.colorPalette?.neutrals || [],
          },
          outfits: parsedResponse.outfits || [],
          accessories: parsedResponse.accessories || [],
          seasonalTips: {
            fabrics: parsedResponse.seasonalTips?.fabrics || [],
            layers: parsedResponse.seasonalTips?.layers || [],
            colors: parsedResponse.seasonalTips?.colors || [],
          },
          bodyTypeTips: {
            tops: parsedResponse.bodyTypeTips?.tops || [],
            bottoms: parsedResponse.bodyTypeTips?.bottoms || [],
            dresses: parsedResponse.bodyTypeTips?.dresses || [],
            general: parsedResponse.bodyTypeTips?.general || [],
          },
        };
      } catch (parseError) {
        console.error("Failed to parse response:", textContent);
        throw new Error("Could not parse recommendations from Gemini");
      }
    } catch (err) {
      console.error("Gemini API request failed:", err);
      throw new Error("Failed to connect to recommendation service");
    }
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
      measurements: {},
    });
  };

  const contextValue = {
    image,
    previewUrl,
    isAnalyzing,
    showCamera,
    error,
    showPreferences,
    preferences,
    analysisResult,
    videoRef,
    fileInputRef,
    handlePreferenceChange,
    handleFileUpload,
    startCamera,
    stopCamera,
    capturePhoto,
    analyzeSkinTone,
    resetAll,
    setShowPreferences,
    outfitImages,
    fetchOutfitImage,
    selectedOutfitImage,
    setSelectedOutfitImage,
  };

  return (
    <RasaAiCTX.Provider value={contextValue}>{children}</RasaAiCTX.Provider>
  );
}
