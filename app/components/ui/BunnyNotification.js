'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Lottie from 'react-lottie-player';

// --- A component for the confetti effect ---
const Confetti = () => {
    const confettiCount = 50;
    const confettiPieces = Array.from({ length: confettiCount });

    return (
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
        <style jsx>{`
          .confetti-piece {
            position: absolute;
            width: 8px;
            height: 16px;
            background-color: #f00; /* Default color */
            top: -20px;
            opacity: 0;
            animation: fall 5s linear forwards;
          }
          @keyframes fall {
            0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0; }
          }
        `}</style>
        {confettiPieces.map((_, index) => {
          const colors = ['#ffc700', '#ff6b6b', '#54a0ff', '#5f27cd', '#2ed573'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomLeft = `${Math.random() * 100}vw`;
          const randomAnimationDelay = `${Math.random() * 3}s`;
          const randomAnimationDuration = `${2 + Math.random() * 3}s`;

          return (
            <div
              key={index}
              className="confetti-piece"
              style={{
                backgroundColor: randomColor,
                left: randomLeft,
                animationDelay: randomAnimationDelay,
                animationDuration: randomAnimationDuration,
              }}
            />
          );
        })}
      </div>
    );
};

// --- Lottie Animation Components with improved error handling ---
const LottieAnimation = ({ url }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        const fetchAnimation = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch animation. Status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Received response was not JSON.");
                }
                const data = await response.json();
                setAnimationData(data);
            } catch (error) {
                console.error("Error fetching or parsing Lottie animation:", error);
            }
        };
        fetchAnimation();
    }, [url]);

    if (!animationData) return <div className="w-16 h-16" />; // Placeholder while loading

    return <Lottie loop={false} play animationData={animationData} style={{ width: 64, height: 64 }} />;
};


export default function BunnyNotification({ message, type, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500); 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4500); 

    return () => clearTimeout(timer);
  }, []); 

  const isSuccess = type === 'success';

  // Premium background gradients
  const successBg = "from-emerald-600 to-teal-800";
  const errorBg = "from-rose-700 to-red-900";

  // --- UPDATED to use local Lottie files from the /public folder ---
  const successLottieUrl = "/animations/success-animation.json";
  const errorLottieUrl = "/animations/error-animation.json";

  return (
    <>
      {isSuccess && <Confetti />}
      <style jsx>{`
        .notification-container {
          animation: slideInFromRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .notification-container.closing {
          animation: slideOutToRight 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
        @keyframes slideInFromRight {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(110%); opacity: 0; }
        }
      `}</style>
      
      <div
        className={`fixed top-5 right-5 z-150 flex items-center gap-3 p-4 rounded-xl shadow-2xl text-white
          bg-gradient-to-br ${isSuccess ? successBg : errorBg}
          notification-container ${isClosing ? 'closing' : ''}`
        }
      >
        <LottieAnimation url={isSuccess ? successLottieUrl : errorLottieUrl} />
        
        <div className="flex-1 pr-4">
          <p className="font-bold text-lg">{isSuccess ? 'Success!' : 'Oh no!'}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </>
  );
}

