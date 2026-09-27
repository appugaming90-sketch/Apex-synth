import React from 'react';
import { BaseBuilding } from '../types';
import { BUILDING_BLUEPRINTS } from '../data/buildingBlueprints';

interface IsometricBuildingSpriteProps {
  building: BaseBuilding;
  isHovered?: boolean;
  activeVehiclePaint?: string;
}

export const IsometricBuildingSprite: React.FC<IsometricBuildingSpriteProps> = ({
  building,
  isHovered = false,
  activeVehiclePaint = '#00f0ff'
}) => {
  const { type, level, isUpgrading } = building;
  const underConstructionClass = isUpgrading ? 'building-under-construction' : '';

  // Render upgraded visual elements based on building type and level
  switch (type) {
    case 'safehouse':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          {/* Holographic Shield Pulse for High Level Safehouse */}
          {level >= 3 && (
            <div className="absolute -inset-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 animate-pulse pointer-events-none" />
          )}

          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <defs>
              <linearGradient id={`sh-wall-left-${building.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id={`sh-wall-right-${building.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id={`sh-roof-${building.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Base Bunker Block */}
            {/* Left Wall */}
            <polygon points="14,92 60,114 60,70 14,48" fill={`url(#sh-wall-left-${building.id})`} stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
            {/* Right Wall */}
            <polygon points="60,114 106,92 106,48 60,70" fill={`url(#sh-wall-right-${building.id})`} stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
            {/* Roof Top */}
            <polygon points="60,26 106,48 60,70 14,48" fill={`url(#sh-roof-${building.id})`} stroke="#00f0ff" strokeWidth="1.5" />

            {/* Reinforced Steel Ribs */}
            <line x1="28" y1="55" x2="28" y2="98" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="44" y1="63" x2="44" y2="106" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="76" y1="63" x2="76" y2="106" stroke="#0284c7" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="92" y1="55" x2="92" y2="98" stroke="#0284c7" strokeWidth="1.5" strokeOpacity="0.7" />

            {/* Blast Door */}
            <polygon points="50,96 60,101 70,96 70,82 60,86 50,82" fill="#00f0ff" fillOpacity="0.25" stroke="#00f0ff" strokeWidth="1" />
            <rect x="58" y="86" width="4" height="12" fill="#00f0ff" />

            {/* Upper Fortress Structure based on Level */}
            {level >= 2 && (
              <>
                {/* Second Tier */}
                <polygon points="32,40 60,26 88,40 60,54" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <polygon points="32,40 60,54 60,42 32,28" fill="#1e293b" />
                <polygon points="60,54 88,40 88,28 60,42" fill="#020617" />
                {/* Satellite Radar Dish */}
                <ellipse cx="60" cy="24" rx="14" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <line x1="60" y1="24" x2="60" y2="8" stroke="#00f0ff" strokeWidth="2" />
                <circle cx="60" cy="8" r="3" fill="#fcee0a" className="animate-ping" />
              </>
            )}

            {level >= 4 && (
              <>
                {/* Apex Helipad marking */}
                <ellipse cx="60" cy="38" rx="8" ry="4" fill="none" stroke="#fcee0a" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="60" y="40" textAnchor="middle" fill="#fcee0a" fontSize="6" fontWeight="bold" fontFamily="monospace">H</text>
              </>
            )}

            {/* Glowing Surveillance Window Slots */}
            <rect x="22" y="65" width="6" height="3" fill="#00f0ff" opacity="0.9" rx="1" />
            <rect x="36" y="72" width="6" height="3" fill="#00f0ff" opacity="0.9" rx="1" />
            <rect x="78" y="72" width="6" height="3" fill="#00f0ff" opacity="0.9" rx="1" />
            <rect x="92" y="65" width="6" height="3" fill="#00f0ff" opacity="0.9" rx="1" />

            {/* Antenna with warning beacon */}
            <line x1="60" y1="26" x2="60" y2="12" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="60" cy="12" r="2.5" fill="#ff0055" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'casino':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Underground Entrance Pavilion */}
            <polygon points="16,90 60,112 60,70 16,48" fill="#2d1038" stroke="#ff0055" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,112 104,90 104,48 60,70" fill="#17081e" stroke="#ff0055" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,26 104,48 60,70 16,48" fill="#4a154b" stroke="#ff0055" strokeWidth="1.5" />

            {/* Neon Portal / Underground Stairs */}
            <polygon points="46,80 60,87 74,80 74,104 60,111 46,104" fill="#09010e" stroke="#ff0055" strokeWidth="1.5" />
            {/* Velvet Carpet Stairs */}
            <line x1="48" y1="88" x2="72" y2="88" stroke="#e11d48" strokeWidth="2" />
            <line x1="50" y1="94" x2="70" y2="94" stroke="#e11d48" strokeWidth="2" />
            <line x1="52" y1="100" x2="68" y2="100" stroke="#e11d48" strokeWidth="2" />

            {/* Glowing Neon 3D Dice on the Roof */}
            <g transform="translate(48, 12) scale(0.8)">
              <polygon points="15,0 30,8 15,16 0,8" fill="#ff0055" stroke="#ffffff" strokeWidth="1" />
              <polygon points="0,8 15,16 15,32 0,24" fill="#be123c" stroke="#ffffff" strokeWidth="1" />
              <polygon points="15,16 30,8 30,24 15,32" fill="#881337" stroke="#ffffff" strokeWidth="1" />
              {/* Dice Pips */}
              <circle cx="15" cy="8" r="1.5" fill="#ffffff" />
              <circle cx="7" cy="18" r="1.5" fill="#ffffff" />
              <circle cx="23" cy="22" r="1.5" fill="#ffffff" />
            </g>

            {/* Spotlights for High Level Casino */}
            {level >= 2 && (
              <>
                <line x1="20" y1="46" x2="10" y2="10" stroke="#ff0055" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
                <line x1="100" y1="46" x2="110" y2="10" stroke="#fcee0a" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
              </>
            )}

            {/* Sign Text */}
            <text x="60" y="58" textAnchor="middle" fill="#ff0055" fontSize="6" fontWeight="bold" fontFamily="monospace">CASINO</text>
          </svg>
        </div>
      );

    case 'factory':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Industrial Complex Block */}
            <polygon points="14,92 60,114 60,72 14,50" fill="#1e293b" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />
            <polygon points="60,114 106,92 106,50 60,72" fill="#0f172a" stroke="#00ff66" strokeWidth="1" strokeOpacity="0.4" />
            <polygon points="60,28 106,50 60,72 14,50" fill="#334155" stroke="#00ff66" strokeWidth="1.5" />

            {/* Heavy Cooling Towers / Chimneys */}
            <rect x="24" y="24" width="10" height="26" fill="#0f172a" stroke="#00ff66" strokeWidth="1" rx="2" />
            <rect x="40" y="16" width="10" height="34" fill="#1e293b" stroke="#00ff66" strokeWidth="1" rx="2" />

            {/* Steam / Exhaust Particle Emission */}
            <circle cx="29" cy="18" r="4" fill="#00ff66" opacity="0.3" className="animate-ping" />
            <circle cx="45" cy="10" r="5" fill="#00ff66" opacity="0.4" className="animate-ping" />

            {/* Robotic Assembler Arm */}
            <line x1="75" y1="65" x2="88" y2="48" stroke="#00ff66" strokeWidth="3" />
            <line x1="88" y1="48" x2="94" y2="60" stroke="#fcee0a" strokeWidth="2" />
            <circle cx="94" cy="60" r="2" fill="#ff0055" className="animate-pulse" />

            {/* Conveyor Bay */}
            <polygon points="46,86 60,93 74,86 74,102 60,109 46,102" fill="#020617" stroke="#00ff66" strokeWidth="1" />
            <line x1="50" y1="92" x2="70" y2="92" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="60" y="60" textAnchor="middle" fill="#00ff66" fontSize="5" fontWeight="bold" fontFamily="monospace">FOUNDRY</text>
          </svg>
        </div>
      );

    case 'nightclub':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Club Geometry */}
            <polygon points="16,92 60,114 60,70 16,48" fill="#1f1430" stroke="#9d4edd" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,114 104,92 104,48 60,70" fill="#120a1e" stroke="#9d4edd" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,26 104,48 60,70 16,48" fill="#38185c" stroke="#c77dff" strokeWidth="1.5" />

            {/* Pulsing Audio Speakers */}
            <rect x="24" y="62" width="10" height="22" rx="2" fill="#090312" stroke="#ff0055" strokeWidth="1" />
            <circle cx="29" cy="69" r="3" fill="#ff0055" className="animate-pulse" />
            <circle cx="29" cy="78" r="4" fill="#9d4edd" className="animate-pulse" />

            <rect x="86" y="62" width="10" height="22" rx="2" fill="#090312" stroke="#ff0055" strokeWidth="1" />
            <circle cx="91" cy="69" r="3" fill="#ff0055" className="animate-pulse" />
            <circle cx="91" cy="78" r="4" fill="#9d4edd" className="animate-pulse" />

            {/* Roof DJ Deck with Laser Show */}
            <line x1="60" y1="26" x2="30" y2="4" stroke="#ff0055" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="60" y1="26" x2="90" y2="4" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="60" y1="26" x2="60" y2="2" stroke="#fcee0a" strokeWidth="1.5" strokeOpacity="0.8" />
            <circle cx="60" cy="26" r="4" fill="#c77dff" className="animate-ping" />

            <text x="60" y="58" textAnchor="middle" fill="#c77dff" fontSize="5.5" fontWeight="bold" fontFamily="monospace">NIGHTCLUB</text>
          </svg>
        </div>
      );

    case 'crypto_rig':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Server Rack Cluster */}
            <polygon points="16,92 60,114 60,70 16,48" fill="#042f2e" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,114 104,92 104,48 60,70" fill="#021c1c" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5" />
            <polygon points="60,26 104,48 60,70 16,48" fill="#115e59" stroke="#00f0ff" strokeWidth="1.5" />

            {/* Server Blades with Blinking Activity LEDs */}
            <line x1="24" y1="62" x2="52" y2="76" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="24" y1="70" x2="52" y2="84" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="24" y1="78" x2="52" y2="92" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 2" />

            <line x1="68" y1="76" x2="96" y2="62" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="68" y1="84" x2="96" y2="70" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="68" y1="92" x2="96" y2="78" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Coolant Pipes */}
            <path d="M 40,40 Q 60,16 80,40" fill="none" stroke="#00f0ff" strokeWidth="2.5" />
            <circle cx="60" cy="24" r="3" fill="#00f0ff" className="animate-ping" />

            <text x="60" y="58" textAnchor="middle" fill="#00f0ff" fontSize="5" fontWeight="bold" fontFamily="monospace">CRYPTO MINE</text>
          </svg>
        </div>
      );

    case 'defense_turret':
      return (
        <div className={`relative w-28 h-32 transition-transform duration-200 ${isHovered ? '-translate-y-1' : ''} ${underConstructionClass}`}>
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.85)]">
            <ellipse cx="60" cy="120" rx="46" ry="16" fill="#000" opacity="0.6" />

            {/* Elevated Turret Bunker Base */}
            <polygon points="22,96 60,114 60,82 22,64" fill="#334155" stroke="#ef4444" strokeWidth="1" />
            <polygon points="60,114 98,96 98,64 60,82" fill="#1e293b" stroke="#ef4444" strokeWidth="1" />
            <polygon points="60,46 98,64 60,82 22,64" fill="#475569" stroke="#ef4444" strokeWidth="1.5" />

            {/* Rotating Armored Turret Head */}
            <circle cx="60" cy="50" r="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
            {/* Dual Twin Plasma Cannons */}
            <line x1="54" y1="46" x2="36" y2="24" stroke="#ef4444" strokeWidth="3" />
            <line x1="66" y1="46" x2="48" y2="24" stroke="#ef4444" strokeWidth="3" />
            {/* Plasma Muzzle Charge */}
            <circle cx="36" cy="24" r="3" fill="#00f0ff" className="animate-ping" />
            <circle cx="48" cy="24" r="3" fill="#00f0ff" className="animate-ping" />

            {/* Target Acquisition Laser Sight */}
            <line x1="42" y1="24" x2="10" y2="2" stroke="#ff0055" strokeWidth="1" strokeDasharray="2 2" />

            <text x="60" y="98" textAnchor="middle" fill="#ef4444" fontSize="5" fontWeight="bold" fontFamily="monospace">PLASMA SENTRY</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
