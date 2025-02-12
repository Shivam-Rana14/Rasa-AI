const SuccessNotification = ({ message, onClose }) => {
  return (
    <div className="fixed top-20 right-4 z-50 bg-color-1/90 text-n-1 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-n-1/50 hover:text-n-1 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
