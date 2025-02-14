import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Collaboration",
    url: "#collaboration",
  },
  {
    id: "2",
    title: "How to use",
    url: "#how-to-use",
    
  },
  {
    id: "3",
    title: "Pricing",
    url: "#pricing",
    
  },
  {
    id: "4",
    title: "Rasa AI",
    url: "/rasa-ai",
    
  },

  {
    id: "5",
    title: "New account",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const DEFAULT_MEASUREMENTS = {
  height: '57', // 5'7" in inches (average adult height)
  bust: '36', // average bust measurement in inches
  waist: '30', // average waist measurement in inches
  hips: '40' // average hip measurement in inches
};

export const OCCASIONS = {
  male: [
    'casual',
    'formal',
    'business',
    'party',
    'sports',
    'wedding'
  ],
  female: [
    'casual',
    'formal',
    'business',
    'party',
    'cocktail',
    'wedding',
    'brunch'
  ]
};

export const BODY_TYPES = {
  male: [
    'athletic',
    'slim',
    'broad',
    'muscular'
  ],
  female: [
    'hourglass',
    'pear',
    'rectangle',
    'apple',
    'athletic'
  ]
};

export const STYLE_PREFERENCES = {
  male: [
    'classic',
    'modern',
    'sporty',
    'business',
    'streetwear'
  ],
  female: [
    'classic',
    'bohemian',
    'minimal',
    'romantic',
    'streetwear',
    'preppy'
  ]
};

export const SEASONS = [
  'spring',
  'summer',
  'fall',
  'winter'
];

export const collabText0 =
  "With our smart AI algorithm , it's the perfect solution for finding outfits tailored just for you.";

export const collabText1 =
  "Rasa AI model is equipped to serve all your fashion needs.";

export const collabText2 =
  "No matter what the ocassion, we are here to help you choose the best outfit..";

export const collabContent = [
  {
    id: "0",
    title: "Seamless AI Integration",
    text: collabText0,
  },
  {
    id: "1",
    title: "Reinforced Learning for better suggestions",
    text: collabText1,
  },
  {
    id: "2",
    title: "Ask anything to fulfill your style needs",
    text: collabText2,
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Nykaa",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Westside",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Nykaa",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Ajio",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Amazon",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "BurgerBae",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Bonkers",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "LittleBox",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI that can understand your fashion needs.",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI model that can analyse complex complexions.",
      "An analytics dashboard to track your evolving fashion interest.",
      "Priority support.",
      "Deliver more accurate color palette.",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: ["Contact Us."],
  },
];

export const benefits = [
  {
    id: "0",
    title: "Personalized Recommendations",
    text: "Get outfit and jewelry suggestions tailored to your unique facial features and color palette.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Time-Saving",
    text: "Skip the hassle of trying multiple options—find what suits you best instantly.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "AI-Powered Precision",
    text: "Leverages advanced AI to deliver accurate and reliable style guidance.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Fast responding",
    text: "Lets users quickly find outfits that best suits their needs.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Accessible to All",
    text: "Works for every skin tone and facial structure, ensuring inclusive style suggestions.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Improve everyday",
    text: "The app uses natural language processing to understand user queries and provide accurate and relevant outfits.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const howToUse = [
  {
    id: "0",
    title: "Upload Your Photo",
    text: "Take a selfie or upload your photo to get started. Our AI will analyze your facial features and skin tone.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: file02,
  },
  {
    id: "1",
    title: "Share Your Style Goals",
    text: "Tell us about the occasion, your preferences, and any specific requirements. The more details, the better!",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: searchMd,
    light: true,
  },
  {
    id: "2",
    title: "Get AI Recommendations",
    text: "Our AI will generate personalized outfit and accessory suggestions based on your unique features and preferences.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: recording03,
  },
  {
    id: "3",
    title: "Explore & Shop",
    text: "Browse through curated recommendations and shop directly from our partner stores for a seamless experience.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: plusSquare,
    light: true,
  },
];

export const SKIN_TONE_PALETTES = {
  1: { // Very Fair
    recommended: ["Soft pastels", "Light blues", "Cool pinks", "Lavender", "Mint green"],
    avoid: ["Neon colors", "Orange", "Bright yellow", "Brown"],
    neutrals: ["Light gray", "Navy", "White", "Soft white"],
    description: "Your fair skin tone looks best with soft, cool colors that complement without overwhelming."
  },
  2: { // Fair
    recommended: ["Deep blues", "Purple", "Cool red", "Emerald", "Teal"],
    avoid: ["Orange-red", "Yellow-green", "Gold"],
    neutrals: ["Gray", "Navy", "White", "Taupe"],
    description: "Your fair skin tone pairs well with rich, cool colors that add contrast without being harsh."
  },
  3: { // Medium
    recommended: ["Coral", "Warm red", "Golden yellow", "Olive green", "Turquoise"],
    avoid: ["Pale pastels", "Light gray", "Beige"],
    neutrals: ["Brown", "Navy", "Cream", "Khaki"],
    description: "Your medium skin tone works beautifully with warm, rich colors that enhance your natural glow."
  },
  4: { // Olive
    recommended: ["Purple", "Ruby red", "Forest green", "Royal blue", "Burgundy"],
    avoid: ["Neon colors", "Light pastels", "Orange"],
    neutrals: ["Navy", "Dark brown", "Charcoal", "Olive"],
    description: "Your olive skin tone looks stunning with deep, rich colors that complement your warm undertones."
  },
  5: { // Tan
    recommended: ["Earth tones", "Warm red", "Orange", "Golden yellow", "Coral"],
    avoid: ["Black", "Navy", "Cool pastels"],
    neutrals: ["Brown", "Camel", "Cream", "Khaki"],
    description: "Your tan skin tone pairs perfectly with warm, earth-toned colors that enhance your natural warmth."
  },
  6: { // Deep
    recommended: ["Bright colors", "Jewel tones", "Pure white", "Royal blue", "Ruby red"],
    avoid: ["Brown", "Dark navy", "Muted tones"],
    neutrals: ["White", "Silver", "Gold", "Charcoal"],
    description: "Your deep skin tone looks radiant with bright, vibrant colors that create stunning contrast."
  }
};

export const OUTFIT_RECOMMENDATIONS = {
  male: {
    casual: {
      minimal: {
        spring: ["Light wash jeans with white tee", "Khaki chinos with gray polo", "Navy shorts with striped tee"],
        summer: ["Light linen shorts with solid tee", "Cotton chinos with short-sleeve henley", "Breathable polo with light shorts"],
        fall: ["Dark jeans with solid sweater", "Chinos with long-sleeve tee", "Khaki pants with light sweater"],
        winter: ["Dark jeans with turtleneck", "Wool pants with sweater", "Chinos with layered knits"]
      },
      modern: {
        spring: ["Slim jeans with printed tee", "Cropped chinos with bomber", "Tech pants with minimal sneakers"],
        summer: ["Tech shorts with fitted tee", "Light wash jeans with Cuban collar shirt", "Performance pants with polo"],
        fall: ["Black jeans with oversized sweater", "Tech pants with minimal hoodie", "Cargo pants with fitted tee"],
        winter: ["Monochrome layers with tech pants", "All-black ensemble with minimal accessories", "Turtleneck with tech trousers"]
      },
      sporty: {
        spring: ["Track pants with fitted tee", "Athletic shorts with performance top", "Tech joggers with zip-up"],
        summer: ["Performance shorts with tank", "Lightweight joggers with breathable tee", "Athletic shorts with muscle tee"],
        fall: ["Premium joggers with hoodie", "Track jacket with matching pants", "Tech fleece set"],
        winter: ["Thermal joggers with performance layers", "Insulated track suit", "Fleece pants with thermal top"]
      }
    },
    formal: {
      classic: {
        spring: ["Navy suit with light blue shirt", "Gray suit with white shirt", "Tan suit with pastel shirt"],
        summer: ["Light gray suit with white shirt", "Khaki suit with blue shirt", "Seersucker suit with solid shirt"],
        fall: ["Charcoal suit with white shirt", "Navy pinstripe with light shirt", "Gray flannel suit"],
        winter: ["Dark wool suit with white shirt", "Black suit with subtle pattern", "Navy suit with crisp white shirt"]
      },
      modern: {
        spring: ["Slim cut suit in light gray", "Navy suit with subtle pattern", "Modern cut blazer with dress pants"],
        summer: ["Lightweight suit in pale blue", "Modern cut suit in light gray", "Tailored separates in summer tones"],
        fall: ["Fitted suit in rich navy", "Modern cut in charcoal", "Slim suit with textured fabric"],
        winter: ["Sharp cut suit in black", "Modern suit with subtle sheen", "Fitted suit in deep charcoal"]
      }
    },
    business: {
      classic: {
        spring: ["Navy blazer with gray trousers", "Light gray suit with blue shirt", "Khaki blazer with navy pants"],
        summer: ["Light weight blazer with chinos", "Seersucker blazer with navy pants", "Tan suit with white shirt"],
        fall: ["Charcoal suit with blue shirt", "Navy blazer with wool trousers", "Gray flannel suit with white shirt"],
        winter: ["Dark wool suit with light shirt", "Navy suit with striped shirt", "Charcoal blazer with gray pants"]
      },
      modern: {
        spring: ["Fitted blazer with cropped pants", "Modern cut suit in light tones", "Tailored separates in spring colors"],
        summer: ["Light weight modern suit", "Fitted blazer with light pants", "Contemporary cut in summer fabrics"],
        fall: ["Slim cut suit in rich colors", "Modern blazer with fitted pants", "Contemporary business separates"],
        winter: ["Sharp modern suit in dark tones", "Fitted winter wool suit", "Contemporary cut in seasonal fabrics"]
      }
    }
  },
  female: {
    casual: {
      minimal: {
        spring: ["White tee with light wash jeans", "Simple dress in neutral tone", "Basic blouse with straight leg pants"],
        summer: ["Cotton dress in solid color", "Light linen pants with basic tank", "Simple shorts with classic tee"],
        fall: ["Straight leg jeans with cashmere sweater", "Simple knit dress", "Basic sweater with slim pants"],
        winter: ["Black jeans with neutral sweater", "Simple sweater dress", "Classic pants with turtleneck"]
      },
      romantic: {
        spring: ["Floral midi dress", "Ruffled blouse with feminine pants", "Lace-detail top with flowing skirt"],
        summer: ["Flowy maxi dress", "Romantic blouse with light pants", "Feminine sundress"],
        fall: ["Soft sweater with pleated skirt", "Romantic blouse with slim pants", "Knit dress with feminine details"],
        winter: ["Velvet dress with subtle details", "Romantic sweater with flowing skirt", "Feminine blouse with wool pants"]
      },
      bohemian: {
        spring: ["Flowing maxi dress", "Peasant top with wide-leg pants", "Embroidered blouse with jeans"],
        summer: ["Printed maxi dress", "Loose cotton dress", "Embroidered top with flowing skirt"],
        fall: ["Layered boho dress", "Printed tunic with leather pants", "Peasant blouse with suede skirt"],
        winter: ["Velvet maxi dress", "Layered bohemian pieces", "Embroidered sweater with wide-leg pants"]
      }
    },
    formal: {
      classic: {
        spring: ["Tailored sheath dress", "Pantsuit in light neutral", "Blazer with matching skirt"],
        summer: ["Light colored suit dress", "Summer weight pantsuit", "Elegant sheath dress"],
        fall: ["Wool blend pantsuit", "Sophisticated sheath dress", "Structured blazer with pencil skirt"],
        winter: ["Classic black suit", "Elegant long sleeve dress", "Wool pantsuit"]
      },
      romantic: {
        spring: ["Lace detail dress", "Feminine suit with subtle ruffles", "Floral formal dress"],
        summer: ["Flowing evening dress", "Light formal dress with details", "Elegant maxi dress"],
        fall: ["Velvet dress with feminine details", "Romantic evening gown", "Sophisticated dress with lace"],
        winter: ["Long sleeve formal dress", "Elegant gown with details", "Sophisticated evening dress"]
      }
    },
    cocktail: {
      classic: {
        spring: ["Knee-length cocktail dress", "Elegant jumpsuit", "Sophisticated midi dress"],
        summer: ["Light cocktail dress", "Elegant short dress", "Sophisticated summer formal"],
        fall: ["Rich colored cocktail dress", "Elegant long sleeve dress", "Sophisticated jumpsuit"],
        winter: ["Velvet cocktail dress", "Classic black dress", "Elegant long sleeve cocktail"]
      },
      romantic: {
        spring: ["Lace cocktail dress", "Feminine party dress", "Floral formal dress"],
        summer: ["Flowing cocktail dress", "Romantic party dress", "Elegant floral dress"],
        fall: ["Detailed cocktail dress", "Romantic evening dress", "Sophisticated lace dress"],
        winter: ["Velvet party dress", "Romantic long sleeve dress", "Elegant detailed dress"]
      }
    }
  }
};

export const ACCESSORY_RECOMMENDATIONS = {
  male: {
    casual: {
      minimal: {
        spring: ["Simple leather watch", "Classic sunglasses", "Canvas belt"],
        summer: ["Minimal watch", "Classic sunglasses", "Woven belt"],
        fall: ["Leather watch", "Classic belt", "Simple scarf"],
        winter: ["Minimal watch", "Leather belt", "Classic beanie"]
      },
      modern: {
        spring: ["Modern watch", "Designer sunglasses", "Minimal bracelet"],
        summer: ["Smart watch", "Modern sunglasses", "Minimal necklace"],
        fall: ["Contemporary watch", "Modern belt", "Sleek scarf"],
        winter: ["Tech watch", "Modern beanie", "Minimal leather gloves"]
      },
      sporty: {
        spring: ["Sports watch", "Athletic sunglasses", "Sports cap"],
        summer: ["Digital watch", "Performance sunglasses", "Sports headband"],
        fall: ["Fitness tracker", "Sports beanie", "Athletic socks"],
        winter: ["Smart sports watch", "Thermal beanie", "Performance gloves"]
      }
    },
    formal: {
      classic: {
        spring: ["Dress watch", "Silk tie", "Leather belt"],
        summer: ["Gold watch", "Light silk tie", "Classic cufflinks"],
        fall: ["Luxury watch", "Wool tie", "Silver cufflinks"],
        winter: ["Premium watch", "Silk tie", "Gold cufflinks"]
      },
      modern: {
        spring: ["Minimal watch", "Skinny tie", "Modern cufflinks"],
        summer: ["Sleek watch", "Slim tie", "Contemporary tie clip"],
        fall: ["Modern chronograph", "Textured tie", "Modern cufflinks"],
        winter: ["Black watch", "Dark tie", "Minimal cufflinks"]
      }
    }
  },
  female: {
    casual: {
      minimal: {
        spring: ["Simple necklace", "Classic watch", "Stud earrings"],
        summer: ["Minimal bracelet", "Simple earrings", "Delicate necklace"],
        fall: ["Classic watch", "Simple scarf", "Minimal rings"],
        winter: ["Minimal jewelry set", "Classic scarf", "Simple boots"]
      },
      romantic: {
        spring: ["Pearl earrings", "Delicate necklace", "Floral scarf"],
        summer: ["Feminine bracelet set", "Floral hair clip", "Delicate anklet"],
        fall: ["Crystal earrings", "Romantic necklace", "Decorative scarf"],
        winter: ["Pearl set", "Embellished scarf", "Romantic brooch"]
      },
      bohemian: {
        spring: ["Layered necklaces", "Hoop earrings", "Woven bracelet"],
        summer: ["Anklet set", "Statement earrings", "Beaded necklace"],
        fall: ["Layered jewelry", "Fringe scarf", "Statement rings"],
        winter: ["Boho necklace set", "Statement scarf", "Mixed metal rings"]
      }
    },
    formal: {
      classic: {
        spring: ["Pearl set", "Classic watch", "Simple clutch"],
        summer: ["Delicate jewelry set", "Evening clutch", "Classic heels"],
        fall: ["Gold jewelry set", "Structured bag", "Classic pumps"],
        winter: ["Diamond studs", "Evening bag", "Classic jewelry"]
      },
      romantic: {
        spring: ["Crystal earrings", "Delicate bracelet", "Embellished clutch"],
        summer: ["Floral jewelry", "Evening bag", "Delicate sandals"],
        fall: ["Romantic jewelry set", "Decorated clutch", "Elegant heels"],
        winter: ["Crystal set", "Evening clutch", "Elegant jewelry"]
      }
    }
  }
};
