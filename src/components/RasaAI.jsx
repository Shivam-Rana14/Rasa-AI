import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './Section';
import Button from './Button';

const OCCASIONS = [
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'party', label: 'Party/Evening' },
  { id: 'business', label: 'Business' },
  { id: 'vacation', label: 'Vacation' },
  { id: 'sports', label: 'Sports/Active' }
];

const BODY_TYPES = [
  { id: 'hourglass', label: 'Hourglass' },
  { id: 'pear', label: 'Pear' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'apple', label: 'Apple' },
  { id: 'inverted-triangle', label: 'Inverted Triangle' }
];

const STYLE_PREFERENCES = [
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'classic', label: 'Classic' },
  { id: 'bohemian', label: 'Bohemian' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'preppy', label: 'Preppy' },
  { id: 'athleisure', label: 'Athleisure' }
];

const SEASONS = [
  { id: 'spring', label: 'Spring' },
  { id: 'summer', label: 'Summer' },
  { id: 'fall', label: 'Fall' },
  { id: 'winter', label: 'Winter' }
];

const DEFAULT_MEASUREMENTS = {
  height: '67', // 5'7" in inches (average adult height)
  bust: '36', // average bust measurement in inches
  waist: '30', // average waist measurement in inches
  hips: '40' // average hip measurement in inches
};

const RasaAI = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    gender: '',
    occasion: '',
    bodyType: '',
    stylePreference: '',
    season: '',
    sustainabilityPreference: false,
    measurements: { ...DEFAULT_MEASUREMENTS }
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [styleHistory, setStyleHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load user preferences and history from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedHistory = localStorage.getItem('styleHistory');
    const savedFavorites = localStorage.getItem('styleFavorites');

    if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
    if (savedHistory) setStyleHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const saveToHistory = (recommendation) => {
    const newHistory = [
      {
        date: new Date().toISOString(),
        recommendation,
        preferences: { ...preferences }
      },
      ...styleHistory
    ].slice(0, 20); // Keep last 20 recommendations
    
    setStyleHistory(newHistory);
    localStorage.setItem('styleHistory', JSON.stringify(newHistory));
  };

  const toggleFavorite = (item) => {
    const newFavorites = favorites.includes(item)
      ? favorites.filter(fav => fav !== item)
      : [...favorites, item];
    
    setFavorites(newFavorites);
    localStorage.setItem('styleFavorites', JSON.stringify(newFavorites));
  };

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
    setPreferences(prev => {
      // Handle nested measurements object
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      // Handle regular fields
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const getRecommendations = (skinTone) => {
    // Enhanced recommendations considering more factors
    const baseRecommendation = {
      colorPalette: getColorPaletteForSkinTone(skinTone),
      outfits: getOutfitsForOccasion(preferences.occasion, skinTone, preferences.gender, preferences.season, preferences.stylePreference),
      accessories: getAccessories(preferences.stylePreference, preferences.occasion, preferences.gender, preferences.season),
      seasonal: getSeasonalAdjustments(preferences.season),
      sustainableOptions: preferences.sustainabilityPreference ? getSustainableAlternatives() : [],
      bodyTypeRecommendations: getBodyTypeSpecificStyles(preferences.bodyType, preferences.gender)
    };

    // Save to history
    saveToHistory(baseRecommendation);

    return baseRecommendation;
  };

  const getBodyTypeSpecificStyles = (bodyType, gender) => {
    const styles = {
      male: {
        athletic: {
          tops: ["Fitted t-shirts", "Structured blazers", "V-neck sweaters"],
          bottoms: ["Straight-leg jeans", "Tailored trousers", "Fitted shorts"],
          outerwear: ["Bomber jackets", "Structured coats", "Sports jackets"]
        },
        slim: {
          tops: ["Layered looks", "Structured shirts", "Textured sweaters"],
          bottoms: ["Slim-fit jeans", "Tapered trousers", "Fitted chinos"],
          outerwear: ["Double-breasted coats", "Denim jackets", "Quilted vests"]
        },
        broad: {
          tops: ["Vertical stripes", "Dark solid colors", "Semi-fitted shirts"],
          bottoms: ["Classic-fit trousers", "Dark wash jeans", "Pleated pants"],
          outerwear: ["Single-breasted jackets", "Lightweight coats", "Classic blazers"]
        }
      },
      female: {
        hourglass: {
          tops: ["Wrap tops", "V-neck blouses", "Fitted jackets"],
          bottoms: ["High-waisted skirts", "Bootcut pants", "Pencil skirts"],
          dresses: ["Wrap dresses", "Belted dresses", "A-line dresses"]
        },
        pear: {
          tops: ["Boat neck tops", "Statement shoulders", "Structured blazers"],
          bottoms: ["A-line skirts", "Wide-leg pants", "Dark bottom pieces"],
          dresses: ["Fit and flare dresses", "Empire waist dresses", "A-line silhouettes"]
        },
        athletic: {
          tops: ["Ruffled blouses", "Cowl necks", "Layered tops"],
          bottoms: ["Full skirts", "Wide-leg trousers", "Textured pants"],
          dresses: ["Wrap style dresses", "Ruched dresses", "Feminine details"]
        }
      }
    };

    return styles[gender]?.[bodyType] || styles[gender]?.athletic || styles.female.athletic;
  };

  const getSeasonalAdjustments = (season) => {
    const adjustments = {
      spring: {
        fabrics: ["Light cotton", "Linen blends", "Light denim"],
        layers: ["Light cardigans", "Denim jackets", "Light blazers"],
        colors: ["Pastels", "Light neutrals", "Soft brights"]
      },
      summer: {
        fabrics: ["Lightweight cotton", "Linen", "Breathable synthetics"],
        layers: ["Kimonos", "Light shawls", "Sun protection layers"],
        colors: ["Bright colors", "Whites", "Light neutrals"]
      },
      fall: {
        fabrics: ["Wool", "Cotton blend", "Leather"],
        layers: ["Cardigans", "Blazers", "Coats"],
        colors: ["Earth tones", "Rich jewel tones", "Deep neutrals"]
      },
      winter: {
        fabrics: ["Heavy wool", "Cashmere", "Fleece"],
        layers: ["Coats", "Parkas", "Thermal layers"],
        colors: ["Dark neutrals", "Rich jewel tones", "Deep berry shades"]
      }
    };

    return adjustments[season] || {};
  };

  const getFabricRecommendations = (season) => {
    const seasonalFabrics = {
      spring: ["Cotton", "Light wool", "Silk blends"],
      summer: ["Linen", "Light cotton", "Bamboo"],
      fall: ["Wool", "Cotton blend", "Leather"],
      winter: ["Heavy wool", "Cashmere", "Fleece"]
    };

    return seasonalFabrics[season] || [];
  };

  const analyzeSkinTone = async () => {
    if (!image || !preferences.occasion || !preferences.bodyType || !preferences.stylePreference || !preferences.season || !preferences.gender) {
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
      gender: '',
      occasion: '',
      bodyType: '',
      stylePreference: '',
      season: '',
      sustainabilityPreference: false,
      measurements: { ...DEFAULT_MEASUREMENTS }
    });
  };

  const renderPreferencesForm = () => (
    <div className="w-full max-w-[640px] p-6 rounded-xl bg-n-6">
      <h3 className="text-2xl font-bold text-n-1 mb-6">Tell us about yourself</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-n-3 mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePreferenceChange('gender', 'male')}
              className={`px-4 py-2 rounded-lg text-sm ${
                preferences.gender === 'male'
                  ? 'bg-color-1 text-n-1'
                  : 'bg-n-5 text-n-3 hover:bg-n-4'
              } transition-colors`}
            >
              Male
            </button>
            <button
              onClick={() => handlePreferenceChange('gender', 'female')}
              className={`px-4 py-2 rounded-lg text-sm ${
                preferences.gender === 'female'
                  ? 'bg-color-1 text-n-1'
                  : 'bg-n-5 text-n-3 hover:bg-n-4'
              } transition-colors`}
            >
              Female
            </button>
          </div>
        </div>

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
          <label className="block text-n-3 mb-2">Body Type</label>
          <div className="grid grid-cols-3 gap-3">
            {BODY_TYPES.map(bodyType => (
              <button
                key={bodyType.id}
                onClick={() => handlePreferenceChange('bodyType', bodyType.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.bodyType === bodyType.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {bodyType.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Style Preference</label>
          <div className="grid grid-cols-3 gap-3">
            {STYLE_PREFERENCES.map(style => (
              <button
                key={style.id}
                onClick={() => handlePreferenceChange('stylePreference', style.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.stylePreference === style.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Season</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SEASONS.map(season => (
              <button
                key={season.id}
                onClick={() => handlePreferenceChange('season', season.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  preferences.season === season.id
                    ? 'bg-color-1 text-n-1'
                    : 'bg-n-5 text-n-3 hover:bg-n-4'
                } transition-colors`}
              >
                {season.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Sustainability Preference</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.sustainabilityPreference}
              onChange={() => handlePreferenceChange('sustainabilityPreference', !preferences.sustainabilityPreference)}
            />
            <span>Prefer sustainable options</span>
          </div>
        </div>

        <div>
          <label className="block text-n-3 mb-2">Measurements</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <input
                type="number"
                value={preferences.measurements.height}
                onChange={(e) => handlePreferenceChange('measurements.height', e.target.value)}
                placeholder="Height (in)"
                min="0"
                step="1"
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-3"
              />
              <span className="text-xs text-n-3 mt-1">Height in inches (default: 5'7")</span>
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                value={preferences.measurements.bust}
                onChange={(e) => handlePreferenceChange('measurements.bust', e.target.value)}
                placeholder="Bust (in)"
                min="0"
                step="1"
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-3"
              />
              <span className="text-xs text-n-3 mt-1">Bust in inches</span>
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                value={preferences.measurements.waist}
                onChange={(e) => handlePreferenceChange('measurements.waist', e.target.value)}
                placeholder="Waist (in)"
                min="0"
                step="1"
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-3"
              />
              <span className="text-xs text-n-3 mt-1">Waist in inches</span>
            </div>
            <div className="flex flex-col">
              <input
                type="number"
                value={preferences.measurements.hips}
                onChange={(e) => handlePreferenceChange('measurements.hips', e.target.value)}
                placeholder="Hips (in)"
                min="0"
                step="1"
                className="px-4 py-2 rounded-lg text-sm bg-n-5 text-n-3"
              />
              <span className="text-xs text-n-3 mt-1">Hips in inches</span>
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
          disabled={!preferences.occasion || !preferences.bodyType || !preferences.stylePreference || !preferences.season || !preferences.gender}
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
          <h3 className="text-2xl font-bold text-n-1 mb-6">Your Style Recommendations</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-n-5">
              <h4 className="text-n-1 font-semibold mb-2">Your Skin Type: {analysisResult.skinTone}</h4>
              <p className="text-n-3 mb-4">{analysisResult.recommendations.colorPalette.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="text-n-3 mb-2">Recommended Colors</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.recommended.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-n-3 mb-2">Colors to Avoid</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.avoid.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-n-6 rounded-lg text-n-1 text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-n-3 mb-2">Best Neutrals</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.colorPalette.neutrals.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-n-4 rounded-lg text-n-1 text-sm"
                      >
                        {color}
                      </span>
                    ))}
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
                {analysisResult.recommendations.accessories.map((accessory, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                  >
                    {accessory}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-n-3 mb-2">Seasonal Style Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-n-3 mb-2">Recommended Fabrics</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.seasonal.fabrics.map((fabric, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                      >
                        {fabric}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-n-3 mb-2">Layering Tips</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendations.seasonal.layers.map((layer, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                      >
                        {layer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {preferences.sustainabilityPreference && (
              <div>
                <h4 className="text-n-3 mb-2">Sustainable Options</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analysisResult.recommendations.sustainableOptions.map((option, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-color-1 rounded-lg text-n-1 text-sm"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-n-3 mb-2">Body Type Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysisResult.recommendations.bodyTypeRecommendations).map(([category, items]) => (
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

  const getColorPaletteForSkinTone = (skinTone) => {
    const palettes = {
      1: { // Very Fair
        recommended: [
          "Soft pastels",
          "Light pink",
          "Powder blue",
          "Mint green",
          "Lavender"
        ],
        avoid: [
          "Neon colors",
          "Orange",
          "Bright yellow",
          "Hot pink"
        ],
        neutrals: [
          "Navy",
          "Gray",
          "Soft white"
        ],
        description: "Your fair skin tone looks best with soft, cool colors. Pastels and muted shades enhance your natural complexion."
      },
      2: { // Fair
        recommended: [
          "Jewel tones",
          "Deep purple",
          "Forest green",
          "Navy blue",
          "Burgundy"
        ],
        avoid: [
          "Bright orange",
          "Neon yellow",
          "Brown",
          "Beige"
        ],
        neutrals: [
          "Charcoal",
          "Navy",
          "Cool gray"
        ],
        description: "Your fair skin tone pairs beautifully with rich jewel tones. These colors create a striking contrast without overwhelming."
      },
      3: { // Light Medium
        recommended: [
          "Coral",
          "Teal",
          "Soft red",
          "Dusty rose",
          "Sage green"
        ],
        avoid: [
          "Neon green",
          "Electric blue",
          "Bright purple",
          "Hot pink"
        ],
        neutrals: [
          "Taupe",
          "Soft brown",
          "Warm gray"
        ],
        description: "Your light medium skin tone works well with both warm and cool colors. Soft, medium-intensity shades are particularly flattering."
      },
      4: { // Medium
        recommended: [
          "Rich brown",
          "Olive green",
          "Deep blue",
          "Warm red",
          "Golden yellow"
        ],
        avoid: [
          "Pale pastels",
          "Light gray",
          "Washed-out colors"
        ],
        neutrals: [
          "Khaki",
          "Chocolate brown",
          "Deep navy"
        ],
        description: "Your medium skin tone can carry both rich and earthy colors beautifully. Warm, saturated hues complement your natural coloring."
      },
      5: { // Medium Dark
        recommended: [
          "Bright yellow",
          "Electric blue",
          "Vibrant orange",
          "Hot pink",
          "Emerald green"
        ],
        avoid: [
          "Pale browns",
          "Muted pastels",
          "Light beige"
        ],
        neutrals: [
          "Dark brown",
          "Deep gray",
          "Rich navy"
        ],
        description: "Your medium dark skin tone shines with bright, vibrant colors. Bold and saturated hues create stunning looks."
      },
      6: { // Dark
        recommended: [
          "Pure white",
          "Bright red",
          "Royal blue",
          "Fuchsia",
          "Kelly green"
        ],
        avoid: [
          "Dark brown",
          "Navy blue",
          "Charcoal gray"
        ],
        neutrals: [
          "Light gray",
          "Cream",
          "Camel"
        ],
        description: "Your dark skin tone is complemented beautifully by bright, clear colors. Light and bright shades create stunning contrast."
      },
      7: { // Very Dark
        recommended: [
          "Bright white",
          "Neon pink",
          "Lime green",
          "Electric blue",
          "Bright orange"
        ],
        avoid: [
          "Dark colors",
          "Deep burgundy",
          "Forest green"
        ],
        neutrals: [
          "Light beige",
          "Soft white",
          "Pearl gray"
        ],
        description: "Your deep skin tone is perfect for the brightest, most vibrant colors. These create beautiful contrast and make a bold statement."
      }
    };

    return palettes[skinTone] || {
      recommended: ["Universal colors"],
      avoid: ["No specific colors to avoid"],
      neutrals: ["Basic neutrals"],
      description: "We couldn't determine your exact skin tone. Try colors that make you feel confident!"
    };
  };

  const getOutfitsForOccasion = (occasion, skinTone, gender, season, stylePreference) => {
    const outfits = {
      male: {
        casual: {
          spring: {
            minimal: [
              "Light cotton t-shirt with khaki chinos",
              "White polo with light wash jeans",
              "Gray henley with navy shorts",
              "Light denim jacket with white tee and beige pants",
              "Pastel oxford shirt with light chinos"
            ],
            bold: [
              "Printed short sleeve shirt with white pants",
              "Bright polo with patterned shorts",
              "Color block tee with light jeans",
              "Statement print tee with khaki shorts",
              "Vibrant henley with light chinos"
            ],
            classic: [
              "Navy polo with beige chinos",
              "Light blue oxford with khaki pants",
              "White henley with light wash jeans",
              "Striped tee with navy shorts",
              "Light sweater with cream chinos"
            ]
          },
          summer: {
            minimal: [
              "Linen shirt with lightweight chinos",
              "Cotton crew neck with shorts",
              "Light jersey polo with breathable pants",
              "Simple v-neck with linen shorts",
              "Basic tee with cotton shorts"
            ],
            bold: [
              "Tropical print shirt with white shorts",
              "Bright colored polo with pattern shorts",
              "Statement tee with light pants",
              "Vibrant tank with neutral shorts",
              "Printed short sleeve with light jeans"
            ],
            classic: [
              "Pique polo with khaki shorts",
              "Cotton oxford with light chinos",
              "White linen shirt with navy shorts",
              "Classic tee with beige shorts",
              "Light chambray with khaki shorts"
            ]
          },
          fall: {
            minimal: [
              "Gray sweater with dark jeans",
              "Navy long sleeve tee with khakis",
              "Black turtleneck with gray pants",
              "Charcoal henley with dark chinos",
              "Simple quarter-zip with jeans"
            ],
            bold: [
              "Burgundy sweater with black jeans",
              "Patterned flannel with dark chinos",
              "Colorful knit with gray pants",
              "Statement cardigan with dark jeans",
              "Rich colored henley with khakis"
            ],
            classic: [
              "Navy sweater with khaki chinos",
              "Brown flannel with dark jeans",
              "Olive henley with tan chinos",
              "Gray cardigan with navy pants",
              "Blue quarter-zip with khakis"
            ]
          },
          winter: {
            minimal: [
              "Black turtleneck with wool pants",
              "Charcoal sweater with dark jeans",
              "Gray cashmere with black chinos",
              "Navy wool sweater with gray pants",
              "Simple knit with dark trousers"
            ],
            bold: [
              "Bright sweater with dark jeans",
              "Patterned turtleneck with black pants",
              "Statement knit with charcoal trousers",
              "Rich colored wool with dark chinos",
              "Colorful cardigan with gray pants"
            ],
            classic: [
              "Navy turtleneck with wool trousers",
              "Camel sweater with dark jeans",
              "Gray cashmere with navy pants",
              "Brown knit with khaki chinos",
              "Classic cardigan with wool pants"
            ]
          }
        },
        formal: {
          spring: {
            minimal: [
              "Light gray suit with white shirt",
              "Navy blazer with light gray pants",
              "Khaki suit with light blue shirt",
              "Light blue blazer with cream pants",
              "Beige suit with white shirt"
            ],
            bold: [
              "Blue suit with patterned shirt",
              "Burgundy blazer with light gray pants",
              "Patterned suit with solid shirt",
              "Colored blazer with contrast pants",
              "Statement suit with subtle shirt"
            ],
            classic: [
              "Navy suit with light blue shirt",
              "Gray blazer with tan pants",
              "Blue suit with white shirt",
              "Tan suit with blue shirt",
              "Navy blazer with khaki pants"
            ]
          },
          // ... Similar structure for other seasons
        },
        business: {
          // ... Similar structure for all seasons
        },
        party: {
          // ... Similar structure for all seasons
        }
      },
      female: {
        casual: {
          spring: {
            minimal: [
              "White t-shirt dress with light denim jacket",
              "Beige sweater with light wash jeans",
              "Simple blouse with cream pants",
              "Light knit top with white jeans",
              "Basic tee with pastel skirt"
            ],
            bold: [
              "Floral dress with denim jacket",
              "Bright blouse with white pants",
              "Patterned top with light jeans",
              "Colorful sweater with neutral pants",
              "Statement top with light skirt"
            ],
            classic: [
              "Navy blazer with white tee and jeans",
              "Striped shirt with khaki pants",
              "Light cardigan with basic tee and jeans",
              "White button-down with light pants",
              "Classic sweater with denim"
            ]
          },
          summer: {
            minimal: [
              "Linen dress in neutral tone",
              "Simple tank with flowing skirt",
              "Cotton tee with light shorts",
              "Basic cami with linen pants",
              "Light jersey dress"
            ],
            bold: [
              "Tropical print dress",
              "Bright colored romper",
              "Statement maxi dress",
              "Patterned shorts with solid top",
              "Colorful sundress"
            ],
            classic: [
              "White linen shirt with cropped pants",
              "Navy dress with white accents",
              "Striped tee with white shorts",
              "Light denim dress",
              "Cotton shirt dress"
            ]
          }
          // ... Similar structure for fall and winter
        },
        formal: {
          // ... Similar structure for all seasons
        },
        business: {
          // ... Similar structure for all seasons
        },
        party: {
          // ... Similar structure for all seasons
        }
      }
    };

    return outfits[gender]?.[occasion]?.[season]?.[stylePreference] || 
           outfits[gender]?.[occasion]?.spring?.classic || 
           ["No specific recommendations available for these preferences"];
  };

  const getAccessories = (stylePreference, occasion, gender, season) => {
    const accessories = {
      male: {
        casual: {
          spring: {
            minimal: ["Simple leather watch", "Classic sunglasses", "Canvas belt"],
            bold: ["Colorful watch", "Statement sunglasses", "Patterned belt", "Bright pocket square"],
            classic: ["Brown leather watch", "Aviator sunglasses", "Leather belt", "Simple bracelet"]
          },
          summer: {
            minimal: ["Sport watch", "Light sunglasses", "Woven belt"],
            bold: ["Bright sport watch", "Colored sunglasses", "Statement hat", "Beaded bracelet"],
            classic: ["Steel watch", "Classic sunglasses", "Braided leather belt"]
          }
          // ... Similar structure for fall and winter
        },
        formal: {
          // ... Similar structure for all seasons
        }
        // ... Similar structure for other occasions
      },
      female: {
        casual: {
          spring: {
            minimal: ["Simple pendant necklace", "Stud earrings", "Delicate bracelet"],
            bold: ["Statement earrings", "Layered necklaces", "Chunky bracelets", "Colorful scarf"],
            classic: ["Pearl earrings", "Chain necklace", "Leather strap watch", "Simple ring"]
          },
          summer: {
            minimal: ["Simple anklet", "Small hoops", "Minimalist necklace"],
            bold: ["Colorful statement earrings", "Shell necklace", "Stacked bracelets", "Hair accessories"],
            classic: ["Pearl studs", "Gold chain", "Classic watch", "Simple bangles"]
          }
          // ... Similar structure for fall and winter
        },
        formal: {
          // ... Similar structure for all seasons
        }
        // ... Similar structure for other occasions
      }
    };

    return accessories[gender]?.[occasion]?.[season]?.[stylePreference] || 
           accessories[gender]?.[occasion]?.spring?.classic || 
           ["Classic accessories suitable for any occasion"];
  };

  const getSustainableAlternatives = () => {
    return [
      "Organic Cotton Pieces",
      "Recycled Polyester Items",
      "Bamboo Fabric Clothing",
      "Hemp-based Materials",
      "Second-hand Designer Items",
      "Locally Made Pieces",
      "Zero-waste Designs"
    ];
  };

  return (
    <Section className="relative overflow-hidden">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          
          <Button
            onClick={() => navigate('/')}
            className="min-w-[8rem]"
          >
            Back Home
          </Button>
        </div>
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
