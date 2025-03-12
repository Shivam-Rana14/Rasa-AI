import { BeatLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-n-8/50 z-50">
      <BeatLoader color="#4F46E5" size={15} />
    </div>
  );
};

export default LoadingSpinner;
