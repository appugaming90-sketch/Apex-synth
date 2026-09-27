import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { REAL_ESTATE_CATALOG, BUSINESSES_CATALOG, getBusinessDef } from '../data/initialData';
import { RealEstate, Business } from '../types';
import { sounds } from '../utils/sound';
import { formatCash } from '../utils/format';
import {
  MapPin,
  Home,
  Building2,
  CheckCircle2,
  Crosshair,
  Compass,
  DollarSign,
  X,
  Key
} from 'lucide-react';

interface CityPlot {
  id: string;
  code: string;
  name: string;
  district: 'Apex Central' | 'Silicon Heights' | 'Marina Bay' | 'Industrial Port';
  type: 'residential' | 'commercial' | 'infrastructure' | 'reserve';
  propertyId?: string;
  businessId?: string;
  price?: number;
  description: string;
  coordinates: string;
  iconType: string;
}

export const DistrictMapTab: React.FC = () => {
  const {
    profile,
    computedNetWorth,
    buyProperty,
    setPrimaryProperty,
    addToast
  } = useGame();

  // Selected filters
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<RealEstate | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState<boolean>(false);

  // Master City Plots Data defining the 2D Cyber Grid
  const CITY_PLOTS: CityPlot[] = [
    // SILICON HEIGHTS (North-West Sector)
    {
      id: 'plot-sh-1',
      code: 'SH-01',
      name: 'Quantum AI Research Foundry',
      district: 'Silicon Heights',
      type: 'commercial',
      businessId: 'biz_tech',
      description: 'Massive automated neural computation cluster licensing algorithms to planetary exchanges.',
      coordinates: 'X: 042 // Y: 018',
      iconType: 'tech'
    },
    {
      id: 'plot-sh-2',
      code: 'SH-02',
      name: 'Horizon Skyline Condo',
      district: 'Silicon Heights',
      type: 'residential',
      propertyId: 're_studio',
      description: 'Panoramic glass-walled aerie with dedicated sub-ether gigabit fiber line.',
      coordinates: 'X: 048 // Y: 025',
      iconType: 'condo'
    },
    {
      id: 'plot-sh-3',
      code: 'SH-03',
      name: 'Neural Transit Junction',
      district: 'Silicon Heights',
      type: 'infrastructure',
      description: 'Magnetic levitation transit node funneling corporate talent to the central core.',
      coordinates: 'X: 035 // Y: 032',
      iconType: 'transit'
    },
    {
      id: 'plot-sh-4',
      code: 'SH-04',
      name: 'Silicon Expansion Lot 4-B',
      district: 'Silicon Heights',
      type: 'reserve',
      price: 500000,
      description: 'Prime zoned high-density parcel awaiting quantum server construction.',
      coordinates: 'X: 055 // Y: 038',
      iconType: 'reserve'
    },

    // APEX CENTRAL (North-East Sector)
    {
      id: 'plot-ac-1',
      code: 'AC-01',
      name: 'Apex Celestial Penthouse',
      district: 'Apex Central',
      type: 'residential',
      propertyId: 're_penthouse',
      description: 'Pinnacle triplex towering 110 stories above the city grid. Absolute oligarch status.',
      coordinates: 'X: 088 // Y: 020',
      iconType: 'penthouse'
    },
    {
      id: 'plot-ac-2',
      code: 'AC-02',
      name: 'Velvet Horizon Nightclub',
      district: 'Apex Central',
      type: 'commercial',
      businessId: 'biz_club',
      description: 'Ultra-exclusive subterranean VIP club frequented by megacorp executives and high-rollers.',
      coordinates: 'X: 078 // Y: 028',
      iconType: 'nightclub'
    },
    {
      id: 'plot-ac-3',
      code: 'AC-03',
      name: 'Aegis Orbital Freight Line',
      district: 'Apex Central',
      type: 'commercial',
      businessId: 'biz_orbital',
      description: 'Heavy suborbital launch silo delivering courier payloads to geosynchronous stations.',
      coordinates: 'X: 092 // Y: 035',
      iconType: 'orbital'
    },
    {
      id: 'plot-ac-4',
      code: 'AC-04',
      name: 'Apex Stock Exchange Core',
      district: 'Apex Central',
      type: 'infrastructure',
      description: 'Central liquid liquidity clearinghouse and central reserve banking node.',
      coordinates: 'X: 082 // Y: 014',
      iconType: 'bank'
    },

    // MARINA BAY (South-East Sector)
    {
      id: 'plot-mb-1',
      code: 'MB-01',
      name: 'Grand Sovereign Compound',
      district: 'Marina Bay',
      type: 'residential',
      propertyId: 're_mansion',
      description: 'Palatial fortified beachfront compound with subterranean 12-vehicle gallery.',
      coordinates: 'X: 085 // Y: 075',
      iconType: 'mansion'
    },
    {
      id: 'plot-mb-2',
      code: 'MB-02',
      name: 'Bel-Air Coastal Villa',
      district: 'Marina Bay',
      type: 'residential',
      propertyId: 're_villa',
      description: 'Ultra-luxury modern villa with cliffside infinity pool and private helipad.',
      coordinates: 'X: 075 // Y: 082',
      iconType: 'villa'
    },
    {
      id: 'plot-mb-3',
      code: 'MB-03',
      name: 'Marina Yacht Slips & Heliport',
      district: 'Marina Bay',
      type: 'infrastructure',
      description: 'Private deep-water berths catering to billionaire superyachts and VTOL shuttles.',
      coordinates: 'X: 095 // Y: 088',
      iconType: 'harbor'
    },
    {
      id: 'plot-mb-4',
      code: 'MB-04',
      name: 'Oceanfront Parcel 12',
      district: 'Marina Bay',
      type: 'reserve',
      price: 1800000,
      description: 'Unencumbered coastal parcel designated for future sovereign compound development.',
      coordinates: 'X: 068 // Y: 070',
      iconType: 'reserve'
    },

    // INDUSTRIAL PORT (South-West Sector)
    {
      id: 'plot-ip-1',
      code: 'IP-01',
      name: 'Neon District Micro-Loft',
      district: 'Industrial Port',
      type: 'residential',
      propertyId: 're_loft',
      description: 'Converted high-ceiling industrial warehouse studio right above the neon market corridor.',
      coordinates: 'X: 025 // Y: 068',
      iconType: 'loft'
    },
    {
      id: 'plot-ip-2',
      code: 'IP-02',
      name: 'Automated Logistics Depot',
      district: 'Industrial Port',
      type: 'commercial',
      businessId: 'biz_workshop',
      description: 'Automated cargo distribution hub routing thousands of delivery drones and trucks daily.',
      coordinates: 'X: 015 // Y: 075',
      iconType: 'depot'
    },
    {
      id: 'plot-ip-3',
      code: 'IP-03',
      name: 'Sub-Zero Hydro Mining Facility',
      district: 'Industrial Port',
      type: 'commercial',
      businessId: 'biz_crypto',
      description: 'Gigawatt geothermal ASIC server farm generating crypto tokens in sub-zero coolant tanks.',
      coordinates: 'X: 032 // Y: 085',
      iconType: 'mine'
    },
    {
      id: 'plot-ip-4',
      code: 'IP-04',
      name: 'Heavy Fusion Sub-Station 07',
      district: 'Industrial Port',
      type: 'infrastructure',
      description: 'Primary fusion tokamak reactor supplying continuous megawatts to the port grid.',
      coordinates: 'X: 018 // Y: 060',
      iconType: 'fusion'
    }
  ];

  // Filtered plots
  const filteredPlots = CITY_PLOTS.filter(plot => {
    if (districtFilter !== 'ALL' && plot.district !== districtFilter) return false;
    if (typeFilter === 'MY_PROPERTIES') {
      const isMyRes = plot.propertyId && profile.ownedProperties.includes(plot.propertyId);
      const isMyBiz = plot.businessId && profile.ownedBusinesses[plot.businessId]?.level > 0;
      return isMyRes || isMyBiz;
    }
    if (typeFilter === 'RESIDENTIAL' && plot.type !== 'residential') return false;
    if (typeFilter === 'COMMERCIAL' && plot.type !== 'commercial') return false;
    return true;
  });

  const handlePlotClick = (plot: CityPlot) => {
    sounds.playClick();

    if (plot.propertyId) {
      const realEstate = REAL_ESTATE_CATALOG.find(r => r.id === plot.propertyId);
      if (realEstate) {
        setSelectedProperty(realEstate);
        setIsPropertyModalOpen(true);
        return;
      }
    }

    if (plot.businessId) {
      const biz = getBusinessDef(plot.businessId);
      const isOwned = profile.ownedBusinesses[plot.businessId]?.level > 0;
      if (isOwned) {
        addToast(
          'Owned Enterprise',
          `${biz?.name} is operational. Go to Black Market to overclock or harvest dividends.`,
          'info'
        );
      } else {
        addToast(
          'Commercial Plot',
          `${biz?.name} is available on Black Market for ${formatCash(((biz as any)?.buyPrice || (biz as any)?.basePrice || 0))}.`,
          'info'
        );
      }
      return;
    }

    if (plot.type === 'infrastructure') {
      addToast('Municipal Node', `${plot.name}: City municipal service node. Public asset.`, 'info');
    } else if (plot.type === 'reserve') {
      addToast('Development Reserve', `${plot.name}: Undeveloped real estate zone.`, 'info');
    }
  };

  // Compute District Owned Count
  const ownedResCount = profile.ownedProperties.length;
  const ownedBizCount = Object.keys(profile.ownedBusinesses).length;

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER: 2D DISTRICT SECTOR MAP TELEMETRY */}
      {/* ------------------------------------------------------------------ */}
      <div className="clip-cyber-corner bg-[#070c18] border border-[#00f0ff]/40 p-5 shadow-neon-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#00f0ff] animate-spin" />
            <h2 className="font-display text-lg font-bold text-white tracking-wider">
              2D INTERACTIVE DISTRICT MAP // CITY SECTORS
            </h2>
          </div>
          <p className="mt-1 text-xs font-hud text-slate-300 max-w-2xl">
            Interactive satellite grid representing metropolis zones. Inspect owned high-rise sanctuaries
            and commercial mega-facilities across city sectors.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FILTER BAR: DISTRICT SECTORS & PROPERTY STATUS */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#00f0ff]/20 pb-3 font-mono text-xs">
        
        {/* District Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <span className="text-slate-500 text-[10px] uppercase mr-1 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#00f0ff]" /> SECTOR:
          </span>
          {['ALL', 'Apex Central', 'Silicon Heights', 'Marina Bay', 'Industrial Port'].map(dist => (
            <button
              key={dist}
              onClick={() => { sounds.playClick(); setDistrictFilter(dist); }}
              className={`px-3 py-1.5 clip-cyber-corner-sm font-bold uppercase whitespace-nowrap transition ${
                districtFilter === dist
                  ? 'bg-[#00f0ff] text-black shadow-neon-cyan font-black'
                  : 'bg-[#050a16] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {dist === 'ALL' ? 'ALL SECTORS' : dist}
            </button>
          ))}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <span className="text-slate-500 text-[10px] uppercase mr-1">SHOW:</span>
          {[
            { id: 'ALL', label: 'ALL PLOTS' },
            { id: 'MY_PROPERTIES', label: `MY ASSETS (${ownedResCount + ownedBizCount})` },
            { id: 'RESIDENTIAL', label: 'HOUSING' },
            { id: 'COMMERCIAL', label: 'COMMERCE' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { sounds.playClick(); setTypeFilter(f.id); }}
              className={`px-2.5 py-1.5 clip-cyber-corner-sm text-[11px] font-bold uppercase whitespace-nowrap transition ${
                typeFilter === f.id
                  ? 'bg-[#fcee0a] text-black shadow-neon-yellow font-black'
                  : 'bg-[#050a16] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2D CITY GRID MAP CANVAS */}
      {/* ------------------------------------------------------------------ */}
      <div className="clip-cyber-corner bg-[#040813] border-2 border-[#00f0ff]/40 p-4 sm:p-6 shadow-2xl relative">
        
        {/* Holographic map header telemetry */}
        <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-3 mb-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00ff66] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#00ff66] animate-ping" />
              SATELLITE LINK ACTIVE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              TOTAL CITY PLOTS: <span className="text-white font-bold">{CITY_PLOTS.length}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-[#9d4edd]">
              <span className="h-2 w-2 bg-[#9d4edd]" /> RESIDENTIAL DEED
            </span>
            <span className="flex items-center gap-1 text-[#00ff66]">
              <span className="h-2 w-2 bg-[#00ff66]" /> ENTERPRISE FOUNDRY
            </span>
            <span className="flex items-center gap-1 text-[#fcee0a]">
              <span className="h-2 w-2 bg-[#fcee0a]" /> CLICK PLOT TO INSPECT
            </span>
          </div>
        </div>

        {/* Interactive 2D Grid Cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlots.map(plot => {
            const isOwnedRes = plot.propertyId && profile.ownedProperties.includes(plot.propertyId);
            const isPrimaryRes = plot.propertyId && profile.primaryPropertyId === plot.propertyId;
            const isOwnedBiz = plot.businessId && profile.ownedBusinesses[plot.businessId]?.level > 0;
            const bizLevel = plot.businessId ? profile.ownedBusinesses[plot.businessId]?.level || 0 : 0;
            const resObj = plot.propertyId ? REAL_ESTATE_CATALOG.find(r => r.id === plot.propertyId) : null;
            const bizObj = plot.businessId ? BUSINESSES_CATALOG.find(b => b.id === plot.businessId) : null;

            let cardBorder = 'border-white/10 bg-[#060d1c] hover:border-[#00f0ff]/50';
            let statusBadge = (
              <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 border border-white/5">
                PUBLIC GRID
              </span>
            );

            if (isOwnedRes) {
              cardBorder = isPrimaryRes
                ? 'border-[#fcee0a] bg-[#1a1205] shadow-neon-yellow'
                : 'border-[#9d4edd] bg-[#160b29] shadow-neon-magenta';
              statusBadge = (
                <span className="text-[9px] font-mono font-black text-black bg-[#9d4edd] px-1.5 py-0.2 clip-cyber-corner-sm flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {isPrimaryRes ? 'PRIMARY SANCTUARY' : 'OWNED RESIDENCE'}
                </span>
              );
            } else if (isOwnedBiz) {
              cardBorder = 'border-[#00ff66] bg-[#051810] shadow-neon-green';
              statusBadge = (
                <span className="text-[9px] font-mono font-black text-black bg-[#00ff66] px-1.5 py-0.2 clip-cyber-corner-sm flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  OWNED TIER {bizLevel}
                </span>
              );
            } else if (plot.type === 'residential' && resObj) {
              statusBadge = (
                <span className="text-[9px] font-mono text-[#9d4edd] bg-[#9d4edd]/10 border border-[#9d4edd]/30 px-1.5 py-0.2">
                  FOR SALE (${(resObj.price / 1000).toFixed(0)}k)
                </span>
              );
            } else if (plot.type === 'commercial' && bizObj) {
              statusBadge = (
                <span className="text-[9px] font-mono text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 px-1.5 py-0.2">
                  FACILITY (${(bizObj.basePrice / 1000).toFixed(0)}k)
                </span>
              );
            }

            return (
              <div
                key={plot.id}
                onClick={() => handlePlotClick(plot)}
                className={`group relative p-4 clip-cyber-corner border flex flex-col justify-between transition-all duration-200 cursor-pointer ${cardBorder} hover:scale-[1.02]`}
              >
                {/* Top Code & Coordinates */}
                <div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[10px] font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.2 border border-[#00f0ff]/30">
                      {plot.code}
                    </span>
                    {statusBadge}
                  </div>

                  {/* 2D Isometric / Blueprint Icon Stage */}
                  <div className="my-3 flex items-center justify-center h-20 bg-[#020408] border border-white/5 relative overflow-hidden clip-cyber-corner-sm">
                    {/* Grid scanline background */}
                    <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

                    {/* Icon Graphic */}
                    {plot.type === 'residential' ? (
                      <div className="relative">
                        <Home className={`h-10 w-10 transition-transform group-hover:scale-110 ${
                          isOwnedRes ? 'text-[#fcee0a] drop-shadow-[0_0_8px_rgba(252,238,10,0.6)]' : 'text-[#9d4edd]'
                        }`} />
                        {isOwnedRes && (
                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#00ff66] animate-ping" />
                        )}
                      </div>
                    ) : plot.type === 'commercial' ? (
                      <div className="relative">
                        <Building2 className={`h-10 w-10 transition-transform group-hover:scale-110 ${
                          isOwnedBiz ? 'text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.6)]' : 'text-[#00f0ff]'
                        }`} />
                        {isOwnedBiz && (
                          <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#00ff66] animate-ping" />
                        )}
                      </div>
                    ) : (
                      <Crosshair className="h-9 w-9 text-slate-600 transition-transform group-hover:rotate-45" />
                    )}

                    {/* Coordinates Stamp */}
                    <div className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-500">
                      {plot.coordinates}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-white text-sm group-hover:text-[#fcee0a] transition-colors leading-tight">
                    {plot.name}
                  </h3>
                  
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-[#00f0ff]">{plot.district}</span>
                    <span className="capitalize">{plot.type}</span>
                  </div>

                  <p className="mt-1 text-[11px] font-hud text-slate-400 line-clamp-2">
                    {plot.description}
                  </p>
                </div>

                {/* Plot Action Hint */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                  {isOwnedRes ? (
                    <span className="text-[#00ff66] font-bold flex items-center gap-1">
                      <Home className="h-3 w-3 text-[#00ff66]" />
                      MANAGE SANCTUARY →
                    </span>
                  ) : isOwnedBiz ? (
                    <span className="text-[#00ff66] font-bold">
                      INSPECT ENTERPRISE →
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      PLOT SPECS →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: RESIDENTIAL PROPERTY INSPECTOR */}
      {/* ------------------------------------------------------------------ */}
      {isPropertyModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl clip-cyber-corner bg-[#050a16] border-2 border-[#9d4edd] shadow-neon-magenta overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#9d4edd]/30 p-4 bg-[#020408]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 clip-cyber-corner-sm bg-[#9d4edd]/20 text-[#9d4edd] border border-[#9d4edd]/40">
                  <Home className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-sm tracking-wider text-glow-magenta">
                    RESIDENTIAL TITLE // {selectedProperty.name.toUpperCase()}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    SECTOR: {selectedProperty.district.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-[#ff0055] transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 font-mono">
              
              {/* Deed Ownership Telemetry */}
              <div className="p-3 bg-[#020408] border border-[#9d4edd]/30 clip-cyber-corner-sm flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase text-slate-400">Property Deed Status</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    {profile.ownedProperties.includes(selectedProperty.id) ? (
                      <span className="text-[#00ff66] flex items-center gap-1 font-black">
                        <CheckCircle2 className="h-3.5 w-3.5" /> DEED RECORDED IN WALLET
                      </span>
                    ) : (
                      <span className="text-[#fcee0a]">AVAILABLE FOR TITLE PURCHASE</span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#fcee0a] bg-[#fcee0a]/10 px-2 py-0.5 border border-[#fcee0a]/30 font-bold">
                  {selectedProperty.category.toUpperCase()} CLASS
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#020408] p-3 border border-white/10 text-center text-xs">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Storage Slots</div>
                  <div className="font-bold text-white mt-0.5">{selectedProperty.storageSlots} units</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Prestige Status</div>
                  <div className="font-bold text-[#fcee0a] mt-0.5">+{selectedProperty.prestige} PTS</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Luxury Upkeep</div>
                  <div className="font-bold text-[#ff0055] mt-0.5">${selectedProperty.luxuryTaxPerHour}/hr</div>
                </div>
              </div>

              <p className="text-xs font-hud text-slate-300">
                {selectedProperty.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="pt-2 space-y-2.5">

                {/* Set Primary Sanctuary */}
                {profile.ownedProperties.includes(selectedProperty.id) && (
                  <button
                    onClick={() => {
                      setPrimaryProperty(selectedProperty.id);
                      setIsPropertyModalOpen(false);
                    }}
                    disabled={profile.primaryPropertyId === selectedProperty.id}
                    className={`w-full py-2 clip-cyber-corner-sm text-xs font-mono font-bold uppercase transition ${
                      profile.primaryPropertyId === selectedProperty.id
                        ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer'
                    }`}
                  >
                    {profile.primaryPropertyId === selectedProperty.id
                      ? '✓ CURRENT PRIMARY SANCTUARY'
                      : 'SET AS PRIMARY SANCTUARY'}
                  </button>
                )}

                {/* Purchase Button if not owned */}
                {!profile.ownedProperties.includes(selectedProperty.id) && (
                  <button
                    onClick={() => {
                      buyProperty(selectedProperty.id);
                      setIsPropertyModalOpen(false);
                    }}
                    disabled={profile.cash < selectedProperty.price}
                    className={`w-full py-3 clip-cyber-corner-sm text-xs font-mono font-black uppercase tracking-wider transition ${
                      profile.cash >= selectedProperty.price
                        ? 'bg-[#9d4edd] hover:bg-[#9d4edd]/90 text-white shadow-neon-magenta cursor-pointer'
                        : 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {profile.cash >= selectedProperty.price
                      ? `PURCHASE DEED (${formatCash(selectedProperty.price)})`
                      : 'INSUFFICIENT CREDITS'}
                  </button>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
