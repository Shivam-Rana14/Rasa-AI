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
    return `Act as a professional fashion stylist and Provide fashion recommendations in this exact JSON format:
    {
      "colorPalette": {
        "description": "text",
        "recommended": ["array of colors according to skin type"],
        "avoid": ["array of colors according to skin type"],
        "neutrals": ["array of colors according to skin type"]
      },
      "outfits": ["array of outfit descriptions"],
      "accessories": ["array of accessory descriptions"],
      "seasonalTips": {
        "fabrics": ["array of fabric suggestion according to season"],
        "layers": ["array of layering suggestion according to season and style"],
        "colors": ["array of recommended colors according to skin type"]
      },
      "bodyTypeTips": {
        "tops": ["array of top suggestions according to body type"],
        "bottoms": ["array of top suggestions according to body type"],
        "dresses": ["array of top suggestions according to body type""],
        "general": ["array of top suggestions according to body type""]
      }
    }
    
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
  };

  return (
    <RasaAiCTX.Provider value={contextValue}>{children}</RasaAiCTX.Provider>
  );
}
