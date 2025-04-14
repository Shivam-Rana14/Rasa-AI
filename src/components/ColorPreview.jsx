const ColorPreview = ({ colorName, colorHex }) => {
  if (!colorHex) return null;

  return (
    <div className="absolute z-50 w-40 h-40 overflow-hidden rounded-lg shadow-lg border border-n-6">
      <div className="w-full h-full" style={{ backgroundColor: colorHex }} />
      <div className="absolute bottom-0 left-0 right-0 bg-n-8/80 p-2 text-center text-n-1 text-sm">
        {colorName} ({colorHex})
      </div>
    </div>
  );
};

export default ColorPreview;
