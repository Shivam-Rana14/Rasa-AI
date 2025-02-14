import React, { useState, useRef } from 'react';
import Section from './Section';

const OCCASIONS = [
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'party', label: 'Party/Evening' },
  { id: 'business', label: 'Business' }
];

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' }
];

const AGE_GROUPS = [
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-45', label: '36-45' },
  { id: '46-55', label: '46-55' },
  { id: '56+', label: '56+' }
];

const RasaAI = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    occasion: '',
    gender: '',
    age: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
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
        video: { facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Capture photo
  const capturePhoto = () => {
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        
        setImage(file);
        setPreviewUrl(url);
        stopCamera();
        setError(null);
      }, 'image/jpeg');
    } catch (err) {
      setError('Failed to capture photo. Please try again.');
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRecommendations = (skinTone) => {
    // Dummy recommendations
    const skinToneRecommendations = {
      1: {
        description: "Very fair skin, always burns, never tans",
        baseColors: ["Soft Pink", "Light Blue", "Mint Green", "Lavender", "Pale Yellow"],
        avoidColors: ["Neon Colors", "Orange", "Brown", "Gold"]
      },
      2: {
        description: "Fair skin, burns easily, tans minimally",
        baseColors: ["Navy", "Cool Red", "Emerald", "Purple", "Teal"],
        avoidColors: ["Orange-Red", "Yellow-Green", "Bronze"]
      },
      3: {
        description: "Medium skin, sometimes burns, gradually tans",
        baseColors: ["Coral", "Turquoise", "Warm Red", "Forest Green", "Royal Blue"],
        avoidColors: ["Neon Yellow", "Pastel Pink", "Gray-Beige"]
      },
      4: {
        description: "Olive skin, rarely burns, tans easily",
        baseColors: ["Gold", "Bright Orange", "Olive Green", "Deep Purple", "Warm Brown"],
        avoidColors: ["Pale Pastels", "Neon Green", "Light Gray"]
      },
      5: {
        description: "Moderately brown skin, rarely burns, tans darkly",
        baseColors: ["Bright Yellow", "Electric Blue", "Fuchsia", "Bronze", "Deep Red"],
        avoidColors: ["Pale Blue", "Light Brown", "Muted Colors"]
      },
      6: {
        description: "Dark brown skin, very rarely burns, always tans",
        baseColors: ["Bright White", "Hot Pink", "Emerald", "Cobalt Blue", "Ruby Red"],
        avoidColors: ["Dark Brown", "Navy Blue", "Charcoal"]
      },
      7: {
        description: "Very dark brown to black skin, never burns",
        baseColors: ["Pure White", "Bright Yellow", "Magenta", "Kelly Green", "Electric Blue"],
        avoidColors: ["Dark Colors", "Black", "Brown"]
      }
    };

    // dummy occasion specific outfit recommendations
    const occasionOutfits = {
      casual: {
        1: ["Light Cotton T-shirts", "Pastel Sundresses", "Light Denim", "Linen Shirts"],
        2: ["Cotton Blouses", "Khaki Pants", "Light Sweaters", "A-line Skirts"],
        3: ["Polo Shirts", "Chinos", "Jersey Dresses", "Denim Jackets"],
        4: ["Printed T-shirts", "Colored Denim", "Maxi Dresses", "Light Cardigans"],
        5: ["Bold Print Shirts", "Bright Casual Dresses", "Statement Denim", "Colorful Tops"],
        6: ["Vibrant T-shirts", "Bright Sundresses", "Patterned Pants", "Statement Pieces"],
        7: ["Bright Casual Wear", "Bold Pattern Dresses", "Colorful Separates", "Statement Accessories"]
      },
      formal: {
        1: ["Pastel Suits", "Light Gray Blazers", "Ivory Dresses", "Pearl-detailed Pieces"],
        2: ["Navy Suits", "Burgundy Dresses", "Charcoal Blazers", "Classic White Shirts"],
        3: ["Gray Suits", "Jewel-tone Dresses", "Structured Blazers", "Silk Blouses"],
        4: ["Brown Suits", "Metallic Dresses", "Earth-tone Blazers", "Gold-accented Pieces"],
        5: ["Bold Suits", "Bright Evening Gowns", "Colorful Blazers", "Statement Formal Wear"],
        6: ["White Suits", "Bright Formal Dresses", "Metallic Blazers", "Contrasting Sets"],
        7: ["White/Bright Suits", "Vibrant Gowns", "Colorful Formal Wear", "Bold Evening Pieces"]
      },
      wedding: {
        1: ["Soft Pink Gowns", "Pastel Suits", "Light Blue Dresses", "Champagne Formal Wear"],
        2: ["Blush Dresses", "Navy Suits", "Lavender Gowns", "Silver-detailed Pieces"],
        3: ["Coral Gowns", "Beige Suits", "Turquoise Dresses", "Gold-accented Formal Wear"],
        4: ["Gold Gowns", "Tan Suits", "Rich Jewel Tones", "Bronze Formal Wear"],
        5: ["Bold Traditional Wear", "Bright Formal Suits", "Metallic Gowns", "Rich Color Formal Wear"],
        6: ["Bright Traditional Wear", "White/Gold Suits", "Jewel-tone Gowns", "Metallic Formal Wear"],
        7: ["White/Gold Traditional Wear", "Bright Suits", "Bold Formal Gowns", "Vibrant Ceremonial Wear"]
      },
      party: {
        1: ["Soft Metallic Dresses", "Light Sequin Tops", "Pastel Party Wear", "Pearl-detailed Pieces"],
        2: ["Silver Dresses", "Deep Blue Party Wear", "Purple Evening Wear", "Metallic Accents"],
        3: ["Gold Dresses", "Red Party Wear", "Emerald Evening Pieces", "Bronze Details"],
        4: ["Bronze Dresses", "Copper Tones", "Rich Evening Wear", "Gold Accents"],
        5: ["Bright Party Dresses", "Metallic Evening Wear", "Bold Separates", "Statement Pieces"],
        6: ["Bright Metallics", "White/Gold Party Wear", "Bold Evening Wear", "Contrasting Pieces"],
        7: ["Bright Colors", "White/Metallic Party Wear", "Vibrant Evening Wear", "Bold Statements"]
      },
      business: {
        1: ["Light Gray Suits", "Soft Pink Blazers", "Ivory Pieces", "Light Blue Formal Wear"],
        2: ["Navy Suits", "Burgundy Blazers", "Gray Professional Wear", "Classic White Shirts"],
        3: ["Charcoal Suits", "Green Blazers", "Blue Professional Wear", "Earth Tone Pieces"],
        4: ["Brown Suits", "Olive Blazers", "Warm Professional Wear", "Gold-tone Accessories"],
        5: ["Bold Suits", "Bright Blazers", "Statement Professional Wear", "Colorful Formal Pieces"],
        6: ["Contrast Suits", "Bright Blazers", "White Professional Wear", "Bold Business Pieces"],
        7: ["White/Bright Suits", "Colorful Blazers", "Vibrant Professional Wear", "Statement Business Wear"]
      }
    };

    const skinToneInfo = skinToneRecommendations[skinTone];
    const outfits = occasionOutfits[preferences.occasion][skinTone];

    return {
      skinToneDescription: skinToneInfo.description,
      colors: {
        recommended: skinToneInfo.baseColors,
        avoid: skinToneInfo.avoidColors
      },
      outfits: outfits
    };
  };

  const analyzeSkinTone = async () => {
    if (!image || !preferences.occasion || !preferences.gender || !preferences.age) {
      setError('Please fill in all preferences before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      const mockSkinTone = Math.floor(Math.random() * 7) + 1;
      const recommendations = getRecommendations(mockSkinTone);
      
      setAnalysisResult({
        skinTone: mockSkinTone,
        preferences: { ...preferences },
        recommendations
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
      occasion: '',
      gender: '',
      age: ''
    });
  };

  const renderPreferencesForm = () => (
    <div className="w-full max-w-[640px] p-6 rounded-xl bg-n-6">
      <h3 className="text-2xl font-bold text-n-1 mb-6">Tell us about yourself</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-n-3 mb-2">Occasion</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OCCASIONS.map(occasion => (
              <button
                key={occasion.id}
                onClick={() => handlePreferenceChange('occasion', occasion.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.occasion === occasion.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {occasion.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {GENDERS.map(gender => (
              <button
                key={gender.id}
                onClick={() => handlePreferenceChange('gender', gender.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.gender === gender.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {gender.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Age Group</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AGE_GROUPS.map(age => (
              <button
                key={age.id}
                onClick={() => handlePreferenceChange('age', age.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.age === age.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {age.label}
              </button>
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
          disabled={!preferences.occasion || !preferences.gender || !preferences.age}
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
        <div className="mt-6 p-6 rounded-xl bg-n-6">
          <h3 className="text-2xl font-bold text-n-1 mb-4">Your Personalized Recommendations</h3>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-n-5">
              <h4 className="text-n-1 font-semibold mb-2">Your Skin Type: {analysisResult.skinTone}</h4>
              <p className="text-n-3">{analysisResult.recommendations.skinToneDescription}</p>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Colors That Complement You</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysisResult.recommendations.colors.recommended.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
              <h4 className="text-n-3 mb-2">Colors to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.recommendations.colors.avoid.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-n-5 rounded-lg text-n-3 text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Recommended {preferences.occasion} Outfits</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.recommendations.outfits.map((outfit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-n-5 rounded-lg text-n-1 text-sm"
                  >
                    {outfit}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-n-3 mt-4">
              <p>These recommendations are tailored for your skin type {analysisResult.skinTone} and {preferences.occasion} occasions. 
              The suggested colors will enhance your natural features while the outfits are designed to complement both your skin tone and the occasion.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2 mx-auto">
        <div className="relative">
          <div className="text-center">
            <h1 className="mb-6 text-5xl lg:text-7xl font-bold text-n-1">
              Skin Tone Analysis
            </h1>
            <p className="mx-auto mb-8 max-w-[800px] text-n-3">
              Get personalized color and outfit recommendations based on your skin tone and preferences
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
