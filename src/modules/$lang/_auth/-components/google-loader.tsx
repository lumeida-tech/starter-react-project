
// Composant Google Dots Loader avec animation circulaire
export default function GoogleDotsLoader({ size = "medium", className = "" }) {
  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

  // Size configurations
  const sizeConfig: any = {
    small: {
      containerSize: "h-8 w-8",
      dotSize: "h-1.5 w-1.5",
    },
    medium: {
      containerSize: "h-10 w-10",
      dotSize: "h-2 w-2",
    },
    large: {
      containerSize: "h-16 w-16",
      dotSize: "h-3 w-3",
    },
  };

  // Get the current size configuration
  const currentSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <div className={`relative ${currentSize.containerSize} ${className}`}>
      {/* Center dot (can be hidden) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"></div>
      
      {/* Rotating dots */}
      <div className="absolute w-full h-full">
        {colors.map((color, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `googleDotSpin 1.6s infinite ease-in-out`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <div
              className={`${currentSize.dotSize} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
              style={{
                backgroundColor: color,
              }}
            />
          </div>
        ))}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes googleDotSpin {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0) translateX(0);
            opacity: 1;
            scale: 1;
          }
          25% {
            opacity: 0.5;
            scale: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg)
              translateX(
                ${size === "small"
                  ? "12px"
                  : size === "large"
                  ? "24px"
                  : "16px"}
              );
            opacity: 0.25;
            scale: 0.8;
          }
          75% {
            opacity: 0.5;
            scale: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

// Version alternative avec une animation plus fidèle au loader Google original
export  function GoogleColorDotsLoader({ size = "medium", className = "" }) {
  // Size configurations
  const sizeConfig: any = {
    small: {
      containerSize: "h-8 w-8",
      dotSize: "h-2 w-2",
    },
    medium: {
      containerSize: "h-12 w-12",
      dotSize: "h-2.5 w-2.5",
    },
    large: {
      containerSize: "h-16 w-16",
      dotSize: "h-3 w-3",
    },
  };

  // Get the current size configuration
  const currentSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <div className={`relative ${currentSize.containerSize} ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Blue Dot */}
          <div
            className={`absolute ${currentSize.dotSize} rounded-full bg-blue-500`}
            style={{
              animation: "googleDotBlue 2s infinite ease-in-out",
              top: 0,
              left: 0,
            }}
          />

          {/* Red Dot */}
          <div
            className={`absolute ${currentSize.dotSize} rounded-full bg-red-500`}
            style={{
              animation: "googleDotRed 2s infinite ease-in-out",
              top: 0,
              right: 0,
            }}
          />

          {/* Yellow Dot */}
          <div
            className={`absolute ${currentSize.dotSize} rounded-full bg-yellow-500`}
            style={{
              animation: "googleDotYellow 2s infinite ease-in-out",
              bottom: 0,
              left: 0,
            }}
          />

          {/* Green Dot */}
          <div
            className={`absolute ${currentSize.dotSize} rounded-full bg-green-500`}
            style={{
              animation: "googleDotGreen 2s infinite ease-in-out",
              bottom: 0,
              right: 0,
            }}
          />
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes googleDotBlue {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              0
            );
          }
          50% {
            transform: translate(
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          75% {
            transform: translate(
              0,
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
        }

        @keyframes googleDotRed {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(
              0,
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          50% {
            transform: translate(
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          75% {
            transform: translate(
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              0
            );
          }
        }

        @keyframes googleDotYellow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              0
            );
          }
          50% {
            transform: translate(
              ${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          75% {
            transform: translate(
              0,
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
        }

        @keyframes googleDotGreen {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(
              0,
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          50% {
            transform: translate(
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"}
            );
          }
          75% {
            transform: translate(
              -${size === "small" ? "8px" : size === "large" ? "20px" : "14px"},
              0
            );
          }
        }
      `}</style>
    </div>
  );
}
