import React, { useRef } from "react";
import type { MouseEvent } from "react";
import { Camera } from "lucide-react"; // or your preferred icon

interface CaptureButtonProps {
  handleCapturePhoto: () => void;
  isLoading: boolean;
  stream: MediaStream | null;
}

export const Button: React.FC<CaptureButtonProps> = ({
  handleCapturePhoto,
  isLoading,
  stream,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.className = "ripple";

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(circle);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isLoading || !stream) return;
    createRipple(e);
    handleCapturePhoto();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isLoading || !stream}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center
        px-8 py-3 text-white font-semibold text-lg rounded-full
        bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
        bg-[length:200%_100%] bg-left
        transition-all duration-500 ease-out
        hover:bg-right
        focus:outline-none focus:ring-4 focus:ring-blue-300
        shadow-md hover:shadow-xl
        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:bg-none disabled:shadow-none
      `}
    >
      <span className="absolute left-4 pointer-events-none">
        <Camera className="w-5 h-5" />
      </span>
      <span className="ml-6 pointer-events-none">Capture</span>
    </button>
  );
};
