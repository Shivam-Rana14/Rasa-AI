// Import TensorFlow.js and BlazeFace model
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // For GPU acceleration if available

// Load required TensorFlow.js models
let modelsLoaded = false;
let faceDetectionModel = null;

const loadModels = async () => {
  if (modelsLoaded) return;

  try {
    // Load face detection model
    await tf.ready();
    faceDetectionModel = await tf.loadGraphModel(
      "https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1",
      { fromTFHub: true }
    );
    modelsLoaded = true;
    console.log("TensorFlow models loaded successfully");
  } catch (error) {
    console.error("Error loading TensorFlow.js models:", error);
    throw new Error("Failed to load machine learning models");
  }
};

// Function to get the actual skin tone using TensorFlow.js
export const getActualSkinTone = async (imageFile) => {
  // Load TensorFlow.js models
  try {
    await loadModels();
  } catch (error) {
    console.error("Failed to load models, falling back to simple analysis");
    return simpleSkinToneAnalysis(imageFile);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        // Create canvas and get context
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Detect face in the image
        const faces = await detectFaces(img);

        if (faces.length === 0) {
          // If no face detected, use the center area of the image as fallback
          const centerRegion = {
            x: Math.max(0, img.width / 2 - (img.width * 0.3) / 2),
            y: Math.max(0, img.height / 2 - (img.height * 0.3) / 2),
            width: img.width * 0.3,
            height: img.height * 0.3,
          };
          const skinTone = await analyzeSkinToneFromRegion(
            canvas,
            centerRegion
          );
          resolve(skinTone);
        } else {
          // Validate face coordinates before using them
          const faceBox = faces[0].boundingBox;
          const safeFaceBox = {
            x: Math.max(0, Number(faceBox.x) || 0),
            y: Math.max(0, Number(faceBox.y) || 0),
            width: Math.min(
              img.width - (Number(faceBox.x) || 0),
              Math.max(0, Number(faceBox.width) || img.width * 0.3)
            ),
            height: Math.min(
              img.height - (Number(faceBox.y) || 0),
              Math.max(0, Number(faceBox.height) || img.height * 0.3)
            ),
          };

          // Focus on middle of the face (forehead area)
          const foreheadRegion = {
            x: Math.max(0, safeFaceBox.x + safeFaceBox.width * 0.25),
            y: Math.max(0, safeFaceBox.y + safeFaceBox.height * 0.15),
            width: Math.min(
              img.width - (safeFaceBox.x + safeFaceBox.width * 0.25),
              safeFaceBox.width * 0.5
            ),
            height: Math.min(
              img.height - (safeFaceBox.y + safeFaceBox.height * 0.15),
              safeFaceBox.height * 0.25
            ),
          };

          const skinTone = await analyzeSkinToneFromRegion(
            canvas,
            foreheadRegion
          );
          resolve(skinTone);
        }
      } catch (err) {
        console.error("Error in skin tone analysis:", err);
        // Final fallback to simple analysis
        simpleSkinToneAnalysis(imageFile).then(resolve).catch(reject);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(imageFile);
  });
};

// Detect faces in the image using BlazeFace model
const detectFaces = async (image) => {
  try {
    // Convert image to tensor
    const imageTensor = tf.browser.fromPixels(image);

    // Resize the image to the expected input shape (128x128)
    const resizedImage = tf.image.resizeBilinear(imageTensor, [128, 128]);

    // Prepare the image as the model expects
    const expandedImg = tf.expandDims(resizedImage, 0);
    const normalizedImg = tf.div(expandedImg, 255);

    // Run face detection
    const predictions = await faceDetectionModel.predict(normalizedImg);

    // Get face detection results
    const faces = await extractFaceBoxes(predictions, [
      image.height,
      image.width,
    ]);

    // Clean up tensors
    tf.dispose([imageTensor, resizedImage, expandedImg, normalizedImg]);
    if (Array.isArray(predictions)) {
      predictions.forEach((tensor) => tensor.dispose());
    } else {
      predictions.dispose();
    }

    return faces;
  } catch (error) {
    console.error("Error detecting faces:", error);
    return []; // Return empty array if face detection fails
  }
};

// Extract face bounding boxes from model predictions
const extractFaceBoxes = async (predictions, imgDims) => {
  try {
    const [height, width] = imgDims;
    let facesArray = [];

    if (Array.isArray(predictions) && predictions.length >= 2) {
      const faceTensor = predictions[0];
      const scoresTensor = predictions[1];

      const scores = await scoresTensor.data();
      const faces = await faceTensor.data();

      const threshold = 0.75;

      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > threshold) {
          const start = i * 16;

          // Convert normalized coordinates to pixel values
          const x = faces[start] * width;
          const y = faces[start + 1] * height;
          const w = faces[start + 2] * width;
          const h = faces[start + 3] * height;

          facesArray.push({
            boundingBox: {
              x: x - w / 2,
              y: y - h / 2,
              width: w,
              height: h,
            },
            confidence: scores[i],
          });
        }
      }
    }

    return facesArray;
  } catch (error) {
    console.error("Error extracting face boxes:", error);
    return [];
  }
};

// Updated ITA-based classification for Indian skin tones
const classifyIndianSkinTone = (ita) => {
  // Adjusted ranges based on Indian skin tone studies
  if (ita > 48) return 1; // Very Fair (Indian equivalent)
  else if (ita > 35) return 2; // Fair
  else if (ita > 25) return 3; // Wheatish
  else if (ita > 15) return 4; // Wheatish-Brown
  else if (ita > 0) return 5; // Brown
  else if (ita > -15) return 6; // Dark Brown
  else return 7; // Deep Dark
};

// Analyze skin tone from a specified region of the image
const analyzeSkinToneFromRegion = async (canvas, region) => {
  try {
    const ctx = canvas.getContext("2d");

    // Convert all values to safe numbers
    const safeRegion = {
      x: Math.max(0, Number(region.x) || 0),
      y: Math.max(0, Number(region.y) || 0),
      width: Math.min(
        canvas.width - (Number(region.x) || 0),
        Math.max(1, Number(region.width) || canvas.width * 0.3)
      ),
      height: Math.min(
        canvas.height - (Number(region.y) || 0),
        Math.max(1, Number(region.height) || canvas.height * 0.3)
      ),
    };

    // Final validation
    if (
      safeRegion.x >= canvas.width ||
      safeRegion.y >= canvas.height ||
      safeRegion.width <= 0 ||
      safeRegion.height <= 0
    ) {
      // Fallback to analyzing the entire image if region is invalid
      console.warn("Invalid region, falling back to full image analysis");
      return analyzeSkinToneFromRegion(canvas, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      });
    }

    // Get image data from the safe region
    const imageData = ctx.getImageData(
      safeRegion.x,
      safeRegion.y,
      safeRegion.width,
      safeRegion.height
    );
    const data = imageData.data;

    // Enhanced skin detection for Indian skin tones
    const skinPixels = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Enhanced YCbCr ranges for Indian skin tones
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // Broader ranges to accommodate Indian skin tones
      if (y > 60 && cb > 70 && cb < 130 && cr > 125 && cr < 180) {
        skinPixels.push([r, g, b]);
      }
    }

    if (skinPixels.length === 0) {
      // If no skin pixels found, use all pixels as fallback
      for (let i = 0; i < data.length; i += 4) {
        skinPixels.push([data[i], data[i + 1], data[i + 2]]);
      }
    }

    // Calculate average RGB values
    const avgColor = skinPixels.reduce(
      (acc, [r, g, b]) => {
        acc.r += r;
        acc.g += g;
        acc.b += b;
        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );

    avgColor.r = Math.round(avgColor.r / skinPixels.length);
    avgColor.g = Math.round(avgColor.g / skinPixels.length);
    avgColor.b = Math.round(avgColor.b / skinPixels.length);

    // Use ITA value for skin tone classification
    const lab = rgbToLab(avgColor.r, avgColor.g, avgColor.b);
    const ita = Math.atan((lab.l - 50) / lab.b) * (180 / Math.PI);

    return classifyIndianSkinTone(ita);
  } catch (error) {
    console.error("Error analyzing skin tone from region:", error);
    // Fallback to full image analysis
    return analyzeSkinToneFromRegion(canvas, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
  }
};

// Helper functions for color space conversion
const rgbToLab = (r, g, b) => {
  try {
    // Convert RGB to XYZ
    const xyz = rgbToXyz(r, g, b);

    // Convert XYZ to Lab
    return xyzToLab(xyz.x, xyz.y, xyz.z);
  } catch (error) {
    console.error("Error in RGB to Lab conversion:", error);
    throw error;
  }
};

const rgbToXyz = (r, g, b) => {
  try {
    // Normalize RGB values
    let rLinear = r / 255;
    let gLinear = g / 255;
    let bLinear = b / 255;

    // Apply gamma correction
    rLinear =
      rLinear > 0.04045
        ? Math.pow((rLinear + 0.055) / 1.055, 2.4)
        : rLinear / 12.92;
    gLinear =
      gLinear > 0.04045
        ? Math.pow((gLinear + 0.055) / 1.055, 2.4)
        : gLinear / 12.92;
    bLinear =
      bLinear > 0.04045
        ? Math.pow((bLinear + 0.055) / 1.055, 2.4)
        : bLinear / 12.92;

    // Convert to XYZ
    const x = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805;
    const y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
    const z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505;

    return { x: x * 100, y: y * 100, z: z * 100 };
  } catch (error) {
    console.error("Error in RGB to XYZ conversion:", error);
    throw error;
  }
};

const xyzToLab = (x, y, z) => {
  try {
    // D65 standard referent
    const xRef = 95.047;
    const yRef = 100.0;
    const zRef = 108.883;

    let xNorm = x / xRef;
    let yNorm = y / yRef;
    let zNorm = z / zRef;

    xNorm =
      xNorm > 0.008856 ? Math.pow(xNorm, 1 / 3) : 7.787 * xNorm + 16 / 116;
    yNorm =
      yNorm > 0.008856 ? Math.pow(yNorm, 1 / 3) : 7.787 * yNorm + 16 / 116;
    zNorm =
      zNorm > 0.008856 ? Math.pow(zNorm, 1 / 3) : 7.787 * zNorm + 16 / 116;

    const l = 116 * yNorm - 16;
    const a = 500 * (xNorm - yNorm);
    const b = 200 * (yNorm - zNorm);

    return { l, a, b };
  } catch (error) {
    console.error("Error in XYZ to Lab conversion:", error);
    throw error;
  }
};

// Updated simple fallback method for Indian skin tones
// Simple fallback analysis
const simpleSkinToneAnalysis = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample from center of image
        const centerX = Math.floor(img.width / 2);
        const centerY = Math.floor(img.height / 2);
        const sampleSize = Math.min(
          100,
          Math.floor(img.width / 4),
          Math.floor(img.height / 4)
        );

        const imageData = ctx.getImageData(
          centerX - sampleSize / 2,
          centerY - sampleSize / 2,
          sampleSize,
          sampleSize
        );

        let totalR = 0,
          totalG = 0,
          totalB = 0,
          count = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
          totalR += imageData.data[i];
          totalG += imageData.data[i + 1];
          totalB += imageData.data[i + 2];
          count++;
        }

        const avgR = totalR / count;
        const avgG = totalG / count;
        const avgB = totalB / count;

        // Convert to Lab color space
        const lab = rgbToLab(avgR, avgG, avgB);
        const ita = Math.atan((lab.l - 50) / lab.b) * (180 / Math.PI);

        resolve(classifyIndianSkinTone(ita));
      } catch (error) {
        console.error("Error in simple skin tone analysis:", error);
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(imageFile);
  });
};
