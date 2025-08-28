
import { Cloud, Database, Server, Shield, Lock } from "lucide-react";
import { useState, useEffect } from "react";

// Définition des mots flottants
const floatingWords = [
  { text: "Cloud Computing", icon: Cloud },
  { text: "VPS Services", icon: Server },
  { text: "Database", icon: Database },
  { text: "Security", icon: Shield },
  { text: "Privacy", icon: Lock },
];

// Calcul des durées aléatoires
const randomDurations = floatingWords.map(() => 4 + Math.random() * 2);

// Calcul des éléments flottants en dehors du composant
const floatingElements = floatingWords.map((word, index) => {
  const angle = index * (360 / floatingWords.length) * (Math.PI / 180);
  const radius = 220; // Distance from center
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const rotationDeg = index * (360 / floatingWords.length);

  return {
    word,
    style: {
      "--translate-x": `${x}px`,
      "--translate-y": `${y}px`,
      "--rotate-deg": `${rotationDeg}deg`,
      "--delay": `${index * 0.7}s`,
      "--duration": `${randomDurations[index]}s`,
    } as React.CSSProperties,
    rotationDeg,
  };
});

export default function FloatingLabels() {
  /*
    |--------------------------------------------------------------------------
    | Data Section
    |--------------------------------------------------------------------------
    | List of all variables used inside the component
    |
    */
  const [isReady, setIsReady] = useState(false);

  /*
    |--------------------------------------------------------------------------
    | Methods Section
    |--------------------------------------------------------------------------
    | List of all functions used inside the component
    |
    */
  useEffect(() => {
    // Petit délai pour s'assurer que les éléments sont positionnés
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /*
    |--------------------------------------------------------------------------
    | Render Section
    |--------------------------------------------------------------------------
    | The component's render method
    |
    */
  return (
    <div className={`floating-container py-20 px-40 ${isReady ? "ready" : ""}`}>
      {floatingElements.map(({ word, style, rotationDeg }) => {
        const Icon = word.icon;
        return (
          <div key={word.text} className="floating-word" style={style}>
            <div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
                               border border-white/20 hover:bg-white/20 transition-colors"
              style={{ transform: `rotate(-${rotationDeg}deg)` }}
            >
              <Icon className="w-4 h-4 text-md text-white" />
              <span className="text-md text-white font-medium whitespace-nowrap">
                {word.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
