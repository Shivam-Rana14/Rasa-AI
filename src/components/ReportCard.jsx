import React, { useState } from "react";

const tagColors = [
  "from-pink-500 to-pink-400",
  "from-blue-500 to-blue-400",
  "from-green-500 to-green-400",
  "from-yellow-500 to-yellow-400",
  "from-purple-500 to-purple-400",
  "from-orange-500 to-orange-400",
  "from-teal-500 to-teal-400",
  "from-red-500 to-red-400",
];

const tagStyle =
  "inline-block px-3 py-1 mr-2 mb-2 rounded-full text-xs font-semibold bg-n-6 text-n-1 shadow border border-n-5";

const SectionTitle = ({ children }) => (
  <div className="font-semibold text-lg mt-4 mb-2 text-n-1 border-l-4 border-color-1 pl-3">
    {children}
  </div>
);

const Collapsible = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        className="flex items-center gap-2 text-color-1 hover:underline focus:outline-none"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{open ? "▼" : "►"}</span>
        <span>{title}</span>
      </button>
      {open && <div className="pl-6 mt-1">{children}</div>}
    </div>
  );
};

const getColorPaletteFromReport = (report) => {
  // Try all possible locations: recommendations.colorPalette, colorPalette at root, or recommendations itself
  if (report?.recommendations?.colorPalette && typeof report.recommendations.colorPalette === 'object') {
    return report.recommendations.colorPalette;
  }
  if (report?.colorPalette && typeof report.colorPalette === 'object') {
    return report.colorPalette;
  }
  // Some reports may have recommended/avoid/neutrals directly under recommendations
  if (report?.recommendations) {
    const rec = report.recommendations;
    if (rec.recommended || rec.avoid || rec.neutrals) {
      return {
        recommended: rec.recommended || [],
        avoid: rec.avoid || [],
        neutrals: rec.neutrals || [],
      };
    }
  }
  return { recommended: [], avoid: [], neutrals: [] };
};

const ReportCard = ({ report, idx, total }) => {
  if (!report || typeof report !== "object")
    return <div className="text-n-3">Invalid report format</div>;

  const { skinTone, preferences, date } = report;
  const { gender, occasion, bodyType, stylePreference, season } = preferences || {};
  const colorPalette = getColorPaletteFromReport(report);
  const outfits = report?.recommendations?.outfits || report.outfits || [];
  const accessories = report?.recommendations?.accessories || report.accessories || [];
  const seasonalTips = report?.recommendations?.seasonalTips || report.seasonalTips || {};
  const bodyTypeTips = report?.recommendations?.bodyTypeTips || report.bodyTypeTips || {};

  // Tag content and order
  const tags = [
    { label: "Skin Tone", value: skinTone ?? "-" },
    { label: "Gender", value: gender },
    { label: "Occasion", value: occasion },
    { label: "Body Type", value: bodyType },
    { label: "Style", value: stylePreference },
    { label: "Season", value: season },
  ];

  // Defensive: handle color arrays as strings or objects
  const renderColors = (colors, section) => {
    if (!Array.isArray(colors)) return <div className="text-n-3 italic">No colors found</div>;
    if (colors.length === 0) return <div className="text-n-3 italic">No colors found</div>;
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {colors.map((color, i) => (
          <span key={i} className="text-n-1 text-base font-medium bg-n-7 px-3 py-1 rounded mb-1">
            {typeof color === "string" ? color : color?.name || "Color"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-n-6 bg-gradient-to-br from-n-7/80 to-n-8/90 shadow-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div className="text-xl font-bold text-n-1">
          Analysis #{total - idx}
        </div>
        <div className="text-xs text-n-4 mt-1 md:mt-0">
          {date ? `Date: ${new Date(date).toLocaleString()}` : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {tags.map(
          (tag, i) =>
            tag.value && (
              <span key={tag.label} className={tagStyle}>
                {tag.label}: <span className="font-bold">{tag.value}</span>
              </span>
            )
        )}
      </div>
      <Collapsible title="Recommended Colors" defaultOpen={true}>
        {renderColors(colorPalette.recommended, "recommended")}
      </Collapsible>
      <Collapsible title="Colors to Avoid" defaultOpen={true}>
        {renderColors(colorPalette.avoid, "avoid")}
      </Collapsible>
      <Collapsible title="Neutrals" defaultOpen={true}>
        {renderColors(colorPalette.neutrals, "neutrals")}
      </Collapsible>
      <Collapsible title="Outfit Recommendations">
        <ul className="list-disc ml-5 text-n-2">
          {outfits.map((o, i) => (
            <li key={i}>{typeof o === "string" ? o : o?.name || JSON.stringify(o)}</li>
          ))}
        </ul>
      </Collapsible>
      <Collapsible title="Accessory Suggestions">
        <ul className="list-disc ml-5 text-n-2">
          {accessories.map((a, i) => (
            <li key={i}>{typeof a === "string" ? a : a?.name || JSON.stringify(a)}</li>
          ))}
        </ul>
      </Collapsible>
      <Collapsible title="Seasonal Tips">
        <div className="text-n-2">
          {Object.entries(seasonalTips).map(([season, tip], i) => (
            <div key={i} className="mb-1">
              <span className="font-semibold text-color-1">{season}:</span> {tip}
            </div>
          ))}
        </div>
      </Collapsible>
      <Collapsible title="Body Type Tips">
        <div className="text-n-2">
          {Object.entries(bodyTypeTips).map(([type, tip], i) => (
            <div key={i} className="mb-1">
              <span className="font-semibold text-color-1">{type}:</span> {tip}
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
};

export default ReportCard;
