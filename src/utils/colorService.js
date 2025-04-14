// utils/ColorService.js
export class ColorService {
  static colorCache = new Map();

  static async fetchColorHexCodes(colorNames) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback to basic colors if no API key
        return this.getBasicColors(colorNames);
      }

      // Check cache first
      const cachedColors = {};
      const colorsToFetch = [];

      colorNames.forEach((name) => {
        if (this.colorCache.has(name)) {
          cachedColors[name] = this.colorCache.get(name);
        } else {
          colorsToFetch.push(name);
        }
      });

      if (colorsToFetch.length === 0) return cachedColors;

      const prompt = `Return a JSON object mapping these color names to hex codes: ${colorsToFetch.join(
        ", "
      )}. Format: {"colorName": "#RRGGBB"}. Use closest match if exact color doesn't exist.`;

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
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonStart = textContent.indexOf("{");
      const jsonEnd = textContent.lastIndexOf("}") + 1;
      const colorMap = JSON.parse(textContent.slice(jsonStart, jsonEnd));

      // Update cache
      Object.entries(colorMap).forEach(([name, hex]) => {
        this.colorCache.set(name, hex);
      });

      return { ...cachedColors, ...colorMap };
    } catch (error) {
      console.error("Failed to fetch color hex codes:", error);
      return this.getBasicColors(colorNames);
    }
  }

  static getBasicColors(colorNames) {
    const basicColors = {
      red: "#FF0000",
      blue: "#0000FF",
      green: "#00FF00",
      yellow: "#FFFF00",
      black: "#000000",
      white: "#FFFFFF",
      pink: "#FFC0CB",
      purple: "#800080",
      orange: "#FFA500",
      gray: "#808080",
      brown: "#A52A2A",
      navy: "#000080",
      teal: "#008080",
    };

    return colorNames.reduce((acc, name) => {
      acc[name] = basicColors[name.toLowerCase()] || "#CCCCCC";
      return acc;
    }, {});
  }
}
