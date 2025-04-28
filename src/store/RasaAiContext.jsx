import { createContext, useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { getActualSkinTone } from "../utils/skinToneAnalysis";

// Context for Rasa AI state and actions
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
  accessoryImages: {},
  fetchAccessoryImage: () => {},
  selectedAccessoryImage: null,
  setSelectedAccessoryImage: () => {},
});

// Provider for Rasa AI context
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
  const [accessoryImages, setAccessoryImages] = useState({});
  const [selectedAccessoryImage, setSelectedAccessoryImage] = useState(null);

  useEffect(() => {
    // This will ensure that TensorFlow.js tries to initialize when the component mounts
    const initTensorflow = async () => {
      try {
        // Just loading TensorFlow is enough, the actual models will load when needed
        await tf.ready();
        console.log("TensorFlow.js initialized successfully");
      } catch (err) {
        console.error("Failed to initialize TensorFlow.js:", err);
        setError("AI models initialization failed");
      }
    };

    initTensorflow();
  }, []);

  // Handles changes to user preferences
  // Called by: context consumers via handlePreferenceChange
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

  // Handles file upload for image selection
  // Called by: context consumers via handleFileUpload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  // Starts the user's camera and displays video preview
  // Called by: context consumers via startCamera
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

  // Stops the user's camera
  // Called by: context consumers via stopCamera and capturePhoto
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Captures a photo from the video stream
  // Called by: context consumers via capturePhoto
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

  // Initiates the skin tone analysis process
  // Called by: context consumers via analyzeSkinTone
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
      const skinTone = await getActualSkinTone(image);
      const prompt = generateGeminiPrompt(skinTone, preferences);
      const recommendations = await getGeminiRecommendations(prompt);
      setAnalysisResultAndSave({
        skinTone,
        preferences: { ...preferences },
        recommendations,
      });
    } catch (err) {
      setError("Failed to analyse skin tone. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setShowPreferences(false);
    }
  };

  // Determines the user's skin tone from an image file
  // Called by: analyzeSkinTone
  // const getActualSkinTone = (imageFile) => {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     img.onload = () => {
  //       try {
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);
  //         const faceRegion = {
  //           x: img.width / 2 - (img.width * 0.3) / 2,
  //           y: img.height / 2 - (img.height * 0.3) / 2,
  //           width: img.width * 0.3,
  //           height: img.height * 0.3,
  //         };
  //         const skinPixels = [];
  //         const imageData = ctx.getImageData(
  //           faceRegion.x,
  //           faceRegion.y,
  //           faceRegion.width,
  //           faceRegion.height
  //         );
  //         const data = imageData.data;
  //         for (let i = 0; i < data.length; i += 20) {
  //           const r = data[i];
  //           const g = data[i + 1];
  //           const b = data[i + 2];
  //           if (r > 100 && g > 50 && b > 50 && r > g && r > b) {
  //             skinPixels.push([r, g, b]);
  //           }
  //         }
  //         if (skinPixels.length === 0) {
  //           throw new Error("Could not detect skin in the image");
  //         }
  //         const avgColor = skinPixels.reduce(
  //           (acc, [r, g, b]) => {
  //             acc.r += r;
  //             acc.g += g;
  //             acc.b += b;
  //             return acc;
  //           },
  //           { r: 0, g: 0, b: 0 }
  //         );
  //         avgColor.r = Math.round(avgColor.r / skinPixels.length);
  //         avgColor.g = Math.round(avgColor.g / skinPixels.length);
  //         avgColor.b = Math.round(avgColor.b / skinPixels.length);
  //         const luminance =
  //           (0.2126 * avgColor.r + 0.7152 * avgColor.g + 0.0722 * avgColor.b) /
  //           255;
  //         let skinTone;
  //         if (luminance < 0.08) skinTone = 7;
  //         else if (luminance < 0.15) skinTone = 6;
  //         else if (luminance < 0.25) skinTone = 5;
  //         else if (luminance < 0.35) skinTone = 4;
  //         else if (luminance < 0.5) skinTone = 3;
  //         else if (luminance < 0.7) skinTone = 2;
  //         else skinTone = 1;
  //         resolve(skinTone);
  //       } catch (err) {
  //         reject(err);
  //       }
  //     };
  //     img.onerror = () => reject(new Error("Failed to load image"));
  //     img.src = URL.createObjectURL(imageFile);
  //   });
  // };

  // Generates the prompt for the Gemini API using skin tone and preferences
  // Called by: analyzeSkinTone
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
        "Outfit suggestion 4",
        "Outfit suggestion 5"
        ],
      "accessories": [
        "Accessories for outfit 1",
        "Accessories for outfit 2",
        "Accessories for outfit 3",
        "Accessories for outfit 4",
        "Accessories for outfit 5"
      ],
      "seasonalTips": {
        "fabrics": ["Fabric 1", "Fabric 2", "Fabric 3"],
        "layers": ["Layering tip 1", "Layering tip 2"],
        "colors": ["Seasonal color 1", "Seasonal color 2", "Seasonal color 3"]
      },
      "bodyTypeTips": {
        "tops": ["Top tip 1", "Top tip 2","Top tip 3"],
        "bottoms": ["Bottom tip 1", "Bottom tip 2","Bottom tip 3],
        "dresses": ["Dress tip 1", "Dress tip 2","Dress tip 3"],
        "general": ["General tip 1", "General tip 2","General tip 3"]
      }
    }
  
    Ensure : Try to avoid same response,Provide latest and relevant response, short, to-the-point suggestions. Ensure the 'accessories' array provides combinations that directly complement each of the 'outfits' in the order they are listed. Give optimal and relevant "seasonalTips" based on Occasion and Season,The "fabrics" and "layers" must be based on Occasion and Season. Provide appropriate "bodyTypeTips" based on Season and Ocassion, Also the array "tops" and "bottoms" must complement each other in the order they are listed.The "colorPalette" must be based on the Skin tone and Occasion.
  
    Based on:
    - Skin tone: ${skinTone}
    - Gender: ${preferences.gender}
    - Occasion: ${preferences.occasion}
    - Body type: ${preferences.bodyType}
    - Style preference: ${preferences.stylePreference}
    - Season: ${preferences.season}`;
  };

  // Calls Gemini API and parses recommendations
  // Called by: analyzeSkinTone
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
          headers: { "Content-Type": "application/json" },
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
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        throw new Error("No valid response from Gemini API");
      }
      try {
        const jsonStart = textContent.indexOf("{");
        const jsonEnd = textContent.lastIndexOf("}") + 1;
        const jsonString = textContent.slice(jsonStart, jsonEnd);
        const parsedResponse = JSON.parse(jsonString);
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
        throw new Error("Could not parse recommendations from Gemini");
      }
    } catch (err) {
      throw new Error("Failed to connect to recommendation service");
    }
  };

  // Sets the analysis result and saves the report
  // Called by: analyzeSkinTone
  const setAnalysisResultAndSave = (result) => {
    let safeResult = { ...result };
    if (!safeResult.recommendations) safeResult.recommendations = {};
    if (!safeResult.recommendations.colorPalette)
      safeResult.recommendations.colorPalette = {};
    const cp = safeResult.recommendations.colorPalette;
    cp.recommended = Array.isArray(cp.recommended) ? cp.recommended : [];
    cp.avoid = Array.isArray(cp.avoid) ? cp.avoid : [];
    cp.neutrals = Array.isArray(cp.neutrals) ? cp.neutrals : [];
    setAnalysisResult(safeResult);
    if (safeResult) {
      saveAnalysisReport({ ...safeResult, date: new Date().toISOString() });
    }
  };

  // Saves the analysis report to the backend
  // Called by: setAnalysisResultAndSave
  const saveAnalysisReport = async (report) => {
    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${BACKEND_URL}/api/profile/analysis-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ report }),
        }
      );
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Failed to save analysis report");
      }
    } catch (err) {
      throw new Error("Failed to save analysis report");
    }
  };

  // Resets all user and analysis state
  // Called by: context consumers via resetAll
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

  // Fetches an outfit image from Pexels API if not cached
  // Called by: context consumers via fetchOutfitImage
  const fetchOutfitImage = async (outfitName) => {
    if (outfitImages[outfitName]) return;
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    if (!apiKey) {
      setError("Pexels API key not found");
      return;
    }
    try {
      const fashionQuery = `${outfitName} fashion outfit clothing apparel`;
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          fashionQuery
        )}&per_page=1`,
        {
          headers: { Authorization: apiKey },
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
      setError("Failed to fetch outfit image");
    }
  };

  // Fetches an accessory image from Pexels API if not cached
  // Called by: context consumers via fetchAccessoryImage
  const fetchAccessoryImage = async (accessoryName) => {
    if (accessoryImages[accessoryName]) return;
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    if (!apiKey) {
      setError("Pexels API key not found");
      return;
    }
    try {
      const accessoryQuery = `${accessoryName} fashion accessory`;
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          accessoryQuery
        )}&per_page=1`,
        {
          headers: { Authorization: apiKey },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Pexels API request failed with status ${response.status}`
        );
      }
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setAccessoryImages((prev) => ({
          ...prev,
          [accessoryName]: data.photos[0].src.medium,
        }));
      }
    } catch (err) {
      setError("Failed to fetch accessory image");
    }
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
    accessoryImages,
    fetchAccessoryImage,
    selectedAccessoryImage,
    setSelectedAccessoryImage,
    setAnalysisResult: setAnalysisResultAndSave,
  };

  return (
    <RasaAiCTX.Provider value={contextValue}>{children}</RasaAiCTX.Provider>
  );
}
