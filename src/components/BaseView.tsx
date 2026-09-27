import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { BaseBuilding } from '../types';
import { BuildingModal } from './BuildingModal';
import { sounds } from '../utils/sound';
import { formatCash } from '../utils/format';
import {
  Coins,
  Sparkles,
  Crown
} from 'lucide-react';

const drawRoundedRect = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (typeof c.roundRect === 'function') {
    c.roundRect(x, y, w, h, r);
  } else {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }
};

export const BaseView: React.FC = () => {
  const {
    profile,
    collectBuildingRevenue,
    collectAllBaseBuildings,
    masteryCrownsCount,
    addToast
  } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedPlot, setSelectedPlot] = useState<{ x: number; y: number } | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BaseBuilding | null>(null);

  // Camera pan & zoom state
  const cameraRef = useRef<{ panX: number; panY: number; zoom: number }>({
    panX: 0,
    panY: 0,
    zoom: 1.0
  });
  const [zoomDisplay, setZoomDisplay] = useState(1.0);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const clickStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const gridSize = profile.gridSize || 5;
  const totalMetroGrid = Math.max(7, gridSize + 2); // Metropolitan sector grid displaying locked expansion zones
  const baseBuildings = profile.baseBuildings || [];

  // Procedural Tile dimensions (true isometric 84x42 diamond)
  const tileWidth = 84;
  const tileHeight = 42;

  // Uncollected revenue calculation
  const totalPendingHarvest = useMemo(() => {
    return Math.floor(baseBuildings.reduce((sum, b) => sum + (b.uncollectedRevenue || 0), 0));
  }, [baseBuildings]);

  // Center the grid camera
  const handleRecenter = useCallback(() => {
    sounds.playClick();
    cameraRef.current = {
      panX: 0,
      panY: 0,
      zoom: 1.0
    };
    setZoomDisplay(1.0);
  }, []);

  // Screen to Grid coordinate mapping
  const screenToGrid = useCallback((screenX: number, screenY: number, width: number, height: number) => {
    const originX = width / 2;
    const originY = Math.max(90, Math.floor(height / 3.2));
    const { panX, panY, zoom } = cameraRef.current;

    const dx = (screenX - originX - panX) / zoom;
    const dy = (screenY - originY - panY) / zoom;

    const c = Math.floor((dy / (tileHeight / 2) + dx / (tileWidth / 2)) / 2);
    const r = Math.floor((dy / (tileHeight / 2) - dx / (tileWidth / 2)) / 2);

    return { gridX: c, gridY: r };
  }, [tileWidth, tileHeight]);

  // Procedural color shade adjuster
  const adjustColor = useCallback((color: string, amount: number): string => {
    return '#' + color.replace(/^#/, '').replace(/../g, c => ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2));
  }, []);

  // Procedural isometric diamond ground tile
  const drawTile = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    color = '#0f172a',
    strokeColor = '#1e293b'
  ) => {
    const h = w / 2;

    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - w / 2, y + h / 2);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // Subtle internal grid border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + w / 2 - 4, y + h / 2);
    ctx.lineTo(x, y + h - 2);
    ctx.lineTo(x - w / 2 + 4, y + h / 2);
    ctx.closePath();
    ctx.stroke();
  }, []);

  // Render Locked "Under Construction" plot with scaffolding, caution lines, and tower cranes
  const drawLockedPlot = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    frame: number,
    isCranePlot: boolean
  ) => {
    const h = w / 2;

    // 1. Excavated industrial ground base
    ctx.fillStyle = '#070a12';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - w / 2, y + h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Diagonal Hazard Caution Tape along perimeter edges
    ctx.save();
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y + h / 2);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 3. 3D Scaffolding Framework (Steel corner poles & diagonal X-braces)
    const scaffoldHeight = 22;
    ctx.strokeStyle = '#f97316'; // Safety orange
    ctx.lineWidth = 1.2;

    // 4 vertical corner scaffolding uprights
    const pts = [
      { px: x, py: y },
      { px: x + w / 2 - 4, py: y + h / 2 },
      { px: x, py: y + h - 2 },
      { px: x - w / 2 + 4, py: y + h / 2 }
    ];

    pts.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.px, p.py - scaffoldHeight);
      ctx.stroke();
    });

    // Scaffolding top ledger ring
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(pts[0].px, pts[0].py - scaffoldHeight);
    ctx.lineTo(pts[1].px, pts[1].py - scaffoldHeight);
    ctx.lineTo(pts[2].px, pts[2].py - scaffoldHeight);
    ctx.lineTo(pts[3].px, pts[3].py - scaffoldHeight);
    ctx.closePath();
    ctx.stroke();

    // Cross bracing X on front faces
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.beginPath();
    ctx.moveTo(pts[3].px, pts[3].py);
    ctx.lineTo(pts[2].px, pts[2].py - scaffoldHeight);
    ctx.moveTo(pts[2].px, pts[2].py);
    ctx.lineTo(pts[3].px, pts[3].py - scaffoldHeight);

    ctx.moveTo(pts[2].px, pts[2].py);
    ctx.lineTo(pts[1].px, pts[1].py - scaffoldHeight);
    ctx.moveTo(pts[1].px, pts[1].py);
    ctx.lineTo(pts[2].px, pts[2].py - scaffoldHeight);
    ctx.stroke();

    // 4. Construction Tower Crane (rendered on select outer boundary plots)
    if (isCranePlot) {
      const craneBaseX = x + 2;
      const craneBaseY = y + h / 2;
      const craneHeight = 52;
      const craneMastTopY = craneBaseY - craneHeight;

      // Vertical yellow lattice tower mast
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(craneBaseX - 3, craneBaseY);
      ctx.lineTo(craneBaseX - 3, craneMastTopY);
      ctx.moveTo(craneBaseX + 3, craneBaseY);
      ctx.lineTo(craneBaseX + 3, craneMastTopY);
      ctx.stroke();

      // Lattice diagonal cross rungs
      ctx.lineWidth = 0.8;
      for (let cy = craneBaseY; cy > craneMastTopY; cy -= 8) {
        ctx.beginPath();
        ctx.moveTo(craneBaseX - 3, cy);
        ctx.lineTo(craneBaseX + 3, cy - 4);
        ctx.lineTo(craneBaseX - 3, cy - 8);
        ctx.stroke();
      }

      // Horizontal Jib Boom Arm
      const boomLength = 32;
      const counterWeightLength = 12;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(craneBaseX - counterWeightLength, craneMastTopY);
      ctx.lineTo(craneBaseX + boomLength, craneMastTopY);
      ctx.stroke();

      // Rear counterweight block
      ctx.fillStyle = '#334155';
      ctx.fillRect(craneBaseX - counterWeightLength - 2, craneMastTopY - 3, 6, 6);

      // Support tie-cables to mast apex
      const apexY = craneMastTopY - 10;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(craneBaseX, craneMastTopY);
      ctx.lineTo(craneBaseX, apexY);
      ctx.lineTo(craneBaseX + boomLength * 0.7, craneMastTopY);
      ctx.moveTo(craneBaseX, apexY);
      ctx.lineTo(craneBaseX - counterWeightLength, craneMastTopY);
      ctx.stroke();

      // Hoist cable with swinging load hook
      const trolleyX = craneBaseX + 18;
      const hookSwing = Math.sin(frame * 0.05) * 2;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(trolleyX, craneMastTopY);
      ctx.lineTo(trolleyX + hookSwing, craneMastTopY + 22);
      ctx.stroke();

      // Concrete pallet or cargo load
      ctx.fillStyle = '#f97316';
      ctx.fillRect(trolleyX + hookSwing - 3, craneMastTopY + 22, 6, 4);

      // Blinking red aircraft warning beacon at crane apex
      const beaconAlpha = (Math.sin(frame * 0.12) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(craneBaseX, apexY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Centered Caution Label
    ctx.font = 'bold 7.5px Orbitron, sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚧 LOCKED', x, y + h / 2 - 2);
    ctx.font = '6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SAFEHOUSE LVL', x, y + h / 2 + 7);
  }, []);

  // Procedural 3D Building renderer with Level 1, 25, 50, 75, 100 Visual Stages
  const drawProceduralBuilding = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    building: BaseBuilding,
    frame: number
  ) => {
    const h = w / 2;
    const level = Math.min(100, Math.max(1, building.level || 1));
    const isMastery = level >= 100;

    // Archetype base heights
    let baseArchetypeHeight = 35;
    const drawType = building.drawType || (building as any).blueprintType;
    if (drawType === 'kiosk') baseArchetypeHeight = 28;
    else if (drawType === 'retail') baseArchetypeHeight = 48;
    else if (drawType === 'commercial') baseArchetypeHeight = 72;
    else if (drawType === 'entertainment') baseArchetypeHeight = 100;
    else if (drawType === 'corporate') baseArchetypeHeight = 135;
    else if (drawType === 'mansion') baseArchetypeHeight = 58;
    else if (building.type === 'safehouse') baseArchetypeHeight = 60;
    else if (building.type === 'factory') baseArchetypeHeight = 70;
    else if (building.type === 'casino') baseArchetypeHeight = 95;
    else if (building.type === 'nightclub') baseArchetypeHeight = 65;
    else if (building.type === 'crypto_rig') baseArchetypeHeight = 40;
    else if (building.type === 'defense_turret') baseArchetypeHeight = 55;

    // Visual Stage Milestones: Dynamic height & architectural evolution at Levels 1, 25, 50, 75, 100
    let stageBonusHeight = 0;
    if (level >= 100) {
      stageBonusHeight = 85; // Stage 5: MAX Mastery Citadel Spire
    } else if (level >= 75) {
      stageBonusHeight = 55 + (level - 75) * 0.8; // Stage 4: Mega Pinnacle Skyscraper
    } else if (level >= 50) {
      stageBonusHeight = 35 + (level - 50) * 0.7; // Stage 3: Corporate High-Rise Tower
    } else if (level >= 25) {
      stageBonusHeight = 18 + (level - 25) * 0.6; // Stage 2: Stepped Commercial Block
    } else {
      stageBonusHeight = (level - 1) * 0.5; // Stage 1: Standard Starter Block
    }

    const bHeight = Math.round(baseArchetypeHeight + stageBonusHeight);
    const baseColor = building.color || '#06b6d4';

    // 1. Ground Drop Shadow (3D depth onto surrounding pavement)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + 4, y + h * 0.75, (w * 0.55), (h * 0.45), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Left Face (Shadow depth with darker contrast)
    ctx.fillStyle = adjustColor(baseColor, isMastery ? -35 : -55);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y + h / 2);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - bHeight);
    ctx.lineTo(x - w / 2, y + h / 2 - bHeight);
    ctx.closePath();
    ctx.fill();

    // Left face vertical architectural pillars
    ctx.strokeStyle = adjustColor(baseColor, -70);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.25, y + h * 0.75);
    ctx.lineTo(x - w * 0.25, y + h * 0.75 - bHeight);
    ctx.stroke();

    // 3. Right Face (Midtone illuminated facade)
    ctx.fillStyle = adjustColor(baseColor, isMastery ? -10 : -25);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.lineTo(x + w / 2, y + h / 2 - bHeight);
    ctx.lineTo(x, y + h - bHeight);
    ctx.closePath();
    ctx.fill();

    // Right face window matrices (floors of glowing cyberpunk lights)
    const floorCount = Math.max(2, Math.floor(bHeight / 12));
    const colCount = level >= 25 ? 4 : 3;
    const windowFloorSpacing = bHeight / (floorCount + 1);

    for (let f = 1; f <= floorCount; f++) {
      const floorOffsetY = f * windowFloorSpacing;
      for (let c = 1; c <= colCount; c++) {
        const colRatio = c / (colCount + 1);
        const winX = x + (w / 2) * colRatio;
        const winY = (y + h) - (h / 2) * colRatio - floorOffsetY;

        // Subtle glowing shimmer on windows
        const shimmer = Math.sin(frame * 0.04 + f * 5 + c * 3);
        const isWindowLit = shimmer > -0.6;

        if (isWindowLit) {
          ctx.fillStyle = isMastery
            ? (shimmer > 0.3 ? '#fef08a' : '#f59e0b')
            : (shimmer > 0.5 ? '#38bdf8' : shimmer > 0 ? '#67e8f9' : '#0284c7');
          ctx.beginPath();
          ctx.moveTo(winX - 3, winY - 1);
          ctx.lineTo(winX + 2, winY - 3.5);
          ctx.lineTo(winX + 2, winY + 1.5);
          ctx.lineTo(winX - 3, winY + 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // 4. Roof Face (Top Highlighted Surface)
    ctx.fillStyle = isMastery ? '#f59e0b' : baseColor;
    ctx.beginPath();
    ctx.moveTo(x, y - bHeight);
    ctx.lineTo(x + w / 2, y + h / 2 - bHeight);
    ctx.lineTo(x, y + h - bHeight);
    ctx.lineTo(x - w / 2, y + h / 2 - bHeight);
    ctx.closePath();
    ctx.fill();

    // Neon Roof Edge Trimming
    ctx.strokeStyle = isMastery ? '#ffd700' : '#ffffff';
    ctx.lineWidth = isMastery ? 1.5 : 0.9;
    ctx.stroke();

    // 5. ROOF DETAILS & STAGE EVOLUTIONS
    const roofCenterY = y + h / 2 - bHeight;

    // Level 25+ Rooftop HVAC and Communication Antennas
    if (level >= 25) {
      // Left antenna mast
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - w * 0.2, roofCenterY - 2);
      ctx.lineTo(x - w * 0.2, roofCenterY - 18);
      ctx.stroke();

      // Flashing warning beacon on antenna tip
      const beaconAlpha = (Math.sin(frame * 0.1) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x - w * 0.2, roofCenterY - 19, 2, 0, Math.PI * 2);
      ctx.fill();

      // Rooftop HVAC chiller unit block
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 4, roofCenterY - 6, 8, 5);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(x + 4, roofCenterY - 6, 8, 5);
    }

    // Level 50+ Helipad with "H" Marking & Radar Dish
    if (level >= 50) {
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x - 2, roofCenterY + 1, 9, 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', x - 2, roofCenterY + 1);

      // Rotating Radar Dish
      const radarAngle = frame * 0.05;
      const radarX = x + w * 0.22;
      const radarY = roofCenterY - 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(radarX, radarY, 4, 2, radarAngle, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Level 75+ Sky-Piercing Pinnacle Spire
    if (level >= 75) {
      ctx.strokeStyle = isMastery ? '#ffd700' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, roofCenterY - 6);
      ctx.lineTo(x, roofCenterY - 28);
      ctx.stroke();

      // Spire Glowing Tip Beacon
      const pulseRadius = 3 + Math.sin(frame * 0.15) * 1.5;
      const grad = ctx.createRadialGradient(x, roofCenterY - 28, 0, x, roofCenterY - 28, pulseRadius * 2);
      grad.addColorStop(0, isMastery ? '#ffffff' : '#00f0ff');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, roofCenterY - 28, pulseRadius * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Level 100: MASTERY CROWN WITH AURA & +50% BOOST
    if (isMastery) {
      const crownBob = Math.sin(frame * 0.08) * 3;
      const crownY = roofCenterY - 32 + crownBob;

      // Golden particle aura
      ctx.save();
      const auraGrad = ctx.createRadialGradient(x, crownY, 2, x, crownY, 24);
      auraGrad.addColorStop(0, 'rgba(255, 215, 0, 0.55)');
      auraGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, crownY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Floating Mastery Crown Icon
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑', x, crownY);

      // Mastery Crown Banner
      drawRoundedRect(ctx, x - 35, crownY - 19, 70, 14, 3);
      ctx.fillStyle = 'rgba(20, 16, 4, 0.94)';
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 8px Orbitron, sans-serif';
      ctx.fillText('👑 MASTERY +50%', x, crownY - 11);
      ctx.restore();
    } else {
      // Standard Level Word Indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Level ${level}`, x, roofCenterY);
    }

    // 6. Uncollected Revenue Floating Pill
    if (building.uncollectedRevenue > 0) {
      const floatOffset = Math.sin(frame * 0.06) * 3;
      const revY = y - bHeight - 16 + floatOffset;
      const revAmount = Math.floor(building.uncollectedRevenue);

      ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.2;
      drawRoundedRect(ctx, x - 30, revY - 7, 60, 14, 4);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`+${formatCash(revAmount)}`, x, revY);
    }
  }, [adjustColor]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;
      if (cssWidth <= 0 || cssHeight <= 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Deep cyber background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#070f1e');
      bgGrad.addColorStop(1, '#02050c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Subtle background cyber grid lines
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;
      const step = 38;
      for (let gx = 0; gx < cssWidth; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, cssHeight);
        ctx.stroke();
      }
      for (let gy = 0; gy < cssHeight; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(cssWidth, gy);
        ctx.stroke();
      }
      ctx.restore();

      const { panX, panY, zoom } = cameraRef.current;
      const originX = cssWidth / 2;
      const originY = Math.max(90, Math.floor(cssHeight / 3.2));

      // Hovered tile calculation
      const { gridX: hoverX, gridY: hoverY } = screenToGrid(
        mousePosRef.current.x,
        mousePosRef.current.y,
        cssWidth,
        cssHeight
      );

      // 1. SURROUNDING ROADS & PERIMETER STREETLIGHTS
      // Draw perimeter roadway around the metropolitan sector (-1 and totalMetroGrid margins)
      ctx.save();
      for (let i = -1; i <= totalMetroGrid; i++) {
        // Top-left road lane (r = -1)
        const rTopX = originX + panX + (i - (-1)) * (tileWidth / 2) * zoom;
        const rTopY = originY + panY + (i + (-1)) * (tileHeight / 2) * zoom;
        drawTile(ctx, rTopX, rTopY, tileWidth * zoom, '#0b1120', '#1e293b');

        // Top-right road lane (c = -1)
        const cLeftX = originX + panX + ((-1) - i) * (tileWidth / 2) * zoom;
        const cLeftY = originY + panY + ((-1) + i) * (tileHeight / 2) * zoom;
        drawTile(ctx, cLeftX, cLeftY, tileWidth * zoom, '#0b1120', '#1e293b');

        // Bottom-left road lane (c = totalMetroGrid)
        const cBottomX = originX + panX + (totalMetroGrid - i) * (tileWidth / 2) * zoom;
        const cBottomY = originY + panY + (totalMetroGrid + i) * (tileHeight / 2) * zoom;
        drawTile(ctx, cBottomX, cBottomY, tileWidth * zoom, '#0b1120', '#1e293b');

        // Bottom-right road lane (r = totalMetroGrid)
        const rRightX = originX + panX + (i - totalMetroGrid) * (tileWidth / 2) * zoom;
        const rRightY = originY + panY + (i + totalMetroGrid) * (tileHeight / 2) * zoom;
        drawTile(ctx, rRightX, rRightY, tileWidth * zoom, '#0b1120', '#1e293b');

        // Streetlights at regular perimeter intervals (every 2 tiles)
        if (i >= 0 && i % 2 === 0) {
          const lampHeight = 22 * zoom;
          // Top streetlight
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(rTopX, rTopY + (tileHeight * zoom) / 2);
          ctx.lineTo(rTopX, rTopY + (tileHeight * zoom) / 2 - lampHeight);
          ctx.lineTo(rTopX + 4 * zoom, rTopY + (tileHeight * zoom) / 2 - lampHeight - 2);
          ctx.stroke();

          // Light cone ground glow
          const glowGrad = ctx.createRadialGradient(
            rTopX,
            rTopY + (tileHeight * zoom) / 2,
            0,
            rTopX,
            rTopY + (tileHeight * zoom) / 2,
            16 * zoom
          );
          glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.ellipse(rTopX, rTopY + (tileHeight * zoom) / 2, 16 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 2. AMBIENT MOVING VEHICLES ALONG ROADS
      const perimeterTiles = totalMetroGrid + 1;
      const vehicleConfigs = [
        { color: '#00f0ff', speed: 0.04, offset: 0 },
        { color: '#fcee0a', speed: 0.06, offset: 2.5 },
        { color: '#ff0055', speed: 0.05, offset: 5.0 },
        { color: '#10b981', speed: 0.035, offset: 7.5 }
      ];

      vehicleConfigs.forEach(veh => {
        const progress = ((frame * veh.speed + veh.offset) % (perimeterTiles * 4));
        let vx = 0;
        let vy = 0;

        if (progress < perimeterTiles) {
          const t = progress;
          vx = originX + panX + (t - (-1)) * (tileWidth / 2) * zoom;
          vy = originY + panY + (t + (-1)) * (tileHeight / 2) * zoom;
        } else if (progress < perimeterTiles * 2) {
          const t = progress - perimeterTiles;
          vx = originX + panX + (totalMetroGrid - t) * (tileWidth / 2) * zoom;
          vy = originY + panY + (totalMetroGrid + t) * (tileHeight / 2) * zoom;
        } else if (progress < perimeterTiles * 3) {
          const t = progress - perimeterTiles * 2;
          vx = originX + panX + ((-1) - t) * (tileWidth / 2) * zoom;
          vy = originY + panY + ((-1) + t) * (tileHeight / 2) * zoom;
        } else {
          const t = progress - perimeterTiles * 3;
          vx = originX + panX + (t - totalMetroGrid) * (tileWidth / 2) * zoom;
          vy = originY + panY + (t + totalMetroGrid) * (tileHeight / 2) * zoom;
        }

        // Draw vehicle body
        ctx.save();
        ctx.fillStyle = veh.color;
        ctx.beginPath();
        ctx.ellipse(vx, vy + (tileHeight * zoom) / 2, 4 * zoom, 2 * zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing headlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(vx + 2 * zoom, vy + (tileHeight * zoom) / 2 - 1, 1 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Taillight glow
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(vx - 2 * zoom, vy + (tileHeight * zoom) / 2 + 1, 1 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. RENDER METROPOLITAN SECTOR PLOTS (Sorted in isometric depth order)
      for (let r = 0; r < totalMetroGrid; r++) {
        for (let c = 0; c < totalMetroGrid; c++) {
          const screenX = originX + panX + (c - r) * (tileWidth / 2) * zoom;
          const screenY = originY + panY + (c + r) * (tileHeight / 2) * zoom;

          const isUnlocked = c < gridSize && r < gridSize;
          const isSelected = isUnlocked && selectedPlot && selectedPlot.x === c && selectedPlot.y === r;
          const isHovered = hoverX === c && hoverY === r;

          if (isUnlocked) {
            // UNLOCKED PLOT
            const tileColor = isSelected ? '#0891b2' : isHovered ? '#164e63' : '#0a101d';
            const strokeColor = isSelected ? '#00f0ff' : isHovered ? '#22d3ee' : '#1e293b';
            drawTile(ctx, screenX, screenY, tileWidth * zoom, tileColor, strokeColor);

            // Watermark coordinates
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillStyle = isHovered ? '#22d3ee' : 'rgba(148, 163, 184, 0.2)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`[${c},${r}]`, screenX, screenY + (tileHeight * zoom) / 2);

            const building = baseBuildings.find(b => b.x === c && b.y === r);

            // If vacant and hovered: draw "+ BUILD"
            if (!building && isHovered) {
              ctx.fillStyle = '#22d3ee';
              ctx.font = 'bold 10px Orbitron, sans-serif';
              ctx.fillText('+ BUILD', screenX, screenY + (tileHeight * zoom) / 2 - 12);
            }

            // Draw procedural 3D building if plot occupied
            if (building) {
              drawProceduralBuilding(ctx, screenX, screenY, tileWidth * zoom, building, frame);
            }
          } else {
            // LOCKED "UNDER CONSTRUCTION" PLOT
            // Place construction crane on corner / perimeter anchor plots
            const isCranePlot = (c === gridSize && r === gridSize) || (c === totalMetroGrid - 1 && r === 0) || (c === 0 && r === totalMetroGrid - 1);
            drawLockedPlot(ctx, screenX, screenY, tileWidth * zoom, frame, isCranePlot);

            if (isHovered) {
              ctx.fillStyle = '#facc15';
              ctx.font = 'bold 8px Orbitron, sans-serif';
              ctx.fillText('CLICK: INFO', screenX, screenY + (tileHeight * zoom) / 2 - 14);
            }
          }
        }
      }

      // 4. SUBTLE TRANSLUCENT DRIFTING CLOUDS OVERHEAD
      const cloudSpeed = 0.3;
      const clouds = [
        { baseX: -100, baseY: 80, scale: 1.2, speed: 0.35 },
        { baseX: 180, baseY: 150, scale: 0.9, speed: 0.25 },
        { baseX: 450, baseY: 70, scale: 1.4, speed: 0.3 }
      ];

      clouds.forEach((cloud, idx) => {
        const cloudX = ((cloud.baseX + frame * cloud.speed) % (cssWidth + 400)) - 200;
        const cloudY = cloud.baseY + Math.sin(frame * 0.01 + idx) * 10;

        ctx.save();
        // Cloud shadow on ground
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.ellipse(cloudX + 40, cloudY + 140, 60 * cloud.scale, 25 * cloud.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Overhead cloud cluster
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 28 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloudX + 30 * cloud.scale, cloudY - 8 * cloud.scale, 35 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(cloudX + 65 * cloud.scale, cloudY, 26 * cloud.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    gridSize,
    totalMetroGrid,
    baseBuildings,
    screenToGrid,
    selectedPlot,
    tileWidth,
    tileHeight,
    drawTile,
    drawLockedPlot,
    drawProceduralBuilding
  ]);

  // Handle Resize using ResizeObserver
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const newWidth = Math.floor(rect.width * dpr);
      const newHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Canvas Mouse / Pointer Interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    clickStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartRef.current = {
      x: e.clientX - cameraRef.current.panX,
      y: e.clientY - cameraRef.current.panY
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (isDraggingRef.current) {
      cameraRef.current.panX = e.clientX - dragStartRef.current.x;
      cameraRef.current.panY = e.clientY - dragStartRef.current.y;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;

    // Check if it was a quick click rather than a drag pan
    const dragDistance = Math.hypot(e.clientX - clickStartRef.current.x, e.clientY - clickStartRef.current.y);
    if (dragDistance > 6) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    const { gridX, gridY } = screenToGrid(screenX, screenY, cssWidth, cssHeight);

    // Clicked an UNLOCKED Plot
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      sounds.playClick();
      const building = baseBuildings.find(b => b.x === gridX && b.y === gridY);
      if (building) {
        if (building.uncollectedRevenue > 0) {
          sounds.playCash();
          collectBuildingRevenue(building.id);
        } else {
          setSelectedBuilding(building);
          setSelectedPlot(null);
        }
      } else {
        setSelectedPlot({ x: gridX, y: gridY });
        setSelectedBuilding(null);
      }
      return;
    }

    // Clicked a LOCKED "Under Construction" Plot
    if (gridX >= 0 && gridX < totalMetroGrid && gridY >= 0 && gridY < totalMetroGrid) {
      sounds.playClick();
      addToast(
        'Sector Under Construction',
        `Plot [${gridX},${gridY}] is locked! Upgrade your Command Safehouse to expand metropolitan grid boundaries.`,
        'warning'
      );
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(2.0, Math.max(0.6, cameraRef.current.zoom + delta));
    cameraRef.current.zoom = newZoom;
    setZoomDisplay(Math.round(newZoom * 100) / 100);
  };

  return (
    <section id="tab-base" ref={containerRef} className="w-full h-full relative">
      <canvas
        id="isometric-canvas"
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Canvas Overlay Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <button
          id="btn-recenter"
          onClick={handleRecenter}
          className="px-3 py-1.5 glass-panel text-xs text-cyan-400 font-orbitron hover:bg-cyan-950/50 rounded border border-cyan-500/40 transition"
        >
          CENTER GRID
        </button>

        {totalPendingHarvest > 0 && (
          <button
            onClick={() => {
              sounds.playCash();
              collectAllBaseBuildings();
            }}
            className="px-3 py-1.5 glass-panel text-xs text-emerald-400 font-orbitron hover:bg-emerald-950/50 rounded border border-emerald-500/40 flex items-center gap-1.5 animate-pulse"
          >
            <Coins className="w-3.5 h-3.5" />
            HARVEST ALL ({formatCash(totalPendingHarvest)})
          </button>
        )}

        {masteryCrownsCount > 0 && (
          <div className="glass-panel px-2.5 py-1 text-[11px] font-orbitron text-yellow-400 rounded border border-yellow-500/40 flex items-center gap-1">
            <Crown className="w-3 h-3 text-yellow-400" />
            <span>{masteryCrownsCount} CROWNS</span>
          </div>
        )}

        <div className="glass-panel px-2.5 py-1 text-[11px] font-mono text-gray-400 rounded border border-gray-700">
          PLOTS: {baseBuildings.length}/{gridSize * gridSize} &bull; ZOOM: {Math.round(zoomDisplay * 100)}%
        </div>
      </div>

      {/* Building Modal: Construct or Manage */}
      <BuildingModal
        selectedPlot={selectedPlot}
        selectedBuilding={selectedBuilding}
        onClose={() => {
          setSelectedPlot(null);
          setSelectedBuilding(null);
        }}
      />
    </section>
  );
};
