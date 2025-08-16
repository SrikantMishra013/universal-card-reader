import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
  </div>
);

export default LoadingSpinner;
