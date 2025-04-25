import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  discord,
  figma,
  file02,
  framer,
  homeSmile,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording03,
  searchMd,
  slack,
  ajio,
  westside,
  nykaa,
  myntra,
  amazon,
  nykaa2,
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
} from "../assets";

export const navigation = [
  {
    id: "5",
    title: "Home",
    url: "#hero",
  },
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
    id: "6",
    title: "Profile",
    url: "/profile",
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [ajio, amazon, nykaa, myntra, westside];

export const collabText0 =
  "With our smart AI algorithm, it's the perfect solution for finding outfits tailored just for you.";

export const collabText1 =
  "Rasa AI model is equipped to serve all your fashion needs.";

export const collabText2 =
  "No matter what the occasion, we are here to help you choose the best outfit.";

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
    icon: nykaa2,
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
    title: "Tata Cliq",
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
    backgroundUrl: card1,
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
    backgroundUrl: card2,
    features: [
      "An advanced AI model that can analyze complex complexions.",
      "An analytics dashboard to track your evolving fashion interest.",
      "Priority support.",
      "Deliver more accurate color palette.",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    backgroundUrl: card3,
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
    backgroundUrl: card4,
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Time-Saving",
    text: "Skip the hassle of trying multiple options—find what suits you best instantly.",
    backgroundUrl: card5,
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "AI-Powered Precision",
    text: "Leverages advanced AI to deliver accurate and reliable style guidance.",
    backgroundUrl: card6,
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Fast responding",
    text: "Lets users quickly find outfits that best suit their needs.",
    backgroundUrl: card1,
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Accessible to All",
    text: "Works for every skin tone and facial structure, ensuring inclusive style suggestions.",
    backgroundUrl: card2,
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Improve everyday",
    text: "The app uses natural language processing to understand user queries and provide accurate and relevant outfits.",
    backgroundUrl: card3,
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const howToUse = [
  {
    id: "0",
    title: "Upload Your Photo",
    text: "Take a selfie or upload your photo to get started. Our AI will analyze your facial features and skin tone.",
    backgroundUrl: card1,
    iconUrl: file02,
  },
  {
    id: "1",
    title: "Share Your Style Goals",
    text: "Tell us about the occasion, your preferences, and any specific requirements. The more details, the better!",
    backgroundUrl: card2,
    iconUrl: searchMd,
    light: true,
  },
  {
    id: "2",
    title: "Get AI Recommendations",
    text: "Our AI will generate personalized outfit and accessory suggestions based on your unique features and preferences.",
    backgroundUrl: card3,
    iconUrl: recording03,
  },
  {
    id: "3",
    title: "Explore & Shop",
    text: "Browse through curated recommendations and shop directly from our partner stores for a seamless experience.",
    backgroundUrl: card4,
    iconUrl: plusSquare,
    light: true,
  },
];
