import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, Satellite, Map as MapIcon, Search, Locate, Flame, 
  CheckCircle2, ShieldAlert 
} from 'lucide-react';

interface LocationPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'emergency' | 'safe_assembly' | 'beacon' | 'hospital';
  details: string;
}

export const RealTimeGeoMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapMode, setMapMode] = useState<'satellite' | 'street'>('satellite');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<LocationPin | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Default regional pins (matching user screenshot region & hospital zones)
  const [incidentPins] = useState<LocationPin[]>([
    {
      id: 'pin-1',
      name: 'Hospital ICU Fire Hazard Unit',
      lat: 21.4392,
      lng: 83.9745,
      type: 'emergency',
      details: 'Active Thermal Flame Node • Room 204 • Sensor SEN-201 Alert'
    },
    {
      id: 'pin-2',
      name: 'East Ramp Safe Evacuation Courtyard',
      lat: 21.4410,
      lng: 83.9780,
      type: 'safe_assembly',
      details: 'Primary Triage Assembly Area • Accessible Egress'
    },
    {
      id: 'pin-3',
      name: 'Budelkani Emergency Response Station',
      lat: 21.4350,
      lng: 83.9680,
      type: 'beacon',
      details: 'First Responder Field Unit #4 • Active Field HUD'
    },
    {
      id: 'pin-4',
      name: 'Julumbahal Dispatch Point',
      lat: 21.4460,
      lng: 83.9710,
      type: 'hospital',
      details: 'Ambulance Backup Base Station'
    }
  ]);

  // Tile layer URLs
  const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const streetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initial map centered around hospital / region coordinates
    const initialLat = 21.4392;
    const initialLng = 83.9745;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false
    });

    mapInstanceRef.current = map;

    // Add initial tile layer (Satellite by default matching screenshot)
    const tileLayer = L.tileLayer(satelliteUrl, {
      attribution: '&copy; Esri World Imagery & OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Custom Map Icons
    const emergencyIcon = L.divIcon({
      className: 'custom-emergency-pin',
      html: `<div style="background:#ef4444; width:28px; height:28px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 15px #ef4444; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:bold;">🔥</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const safeIcon = L.divIcon({
      className: 'custom-safe-pin',
      html: `<div style="background:#10b981; width:28px; height:28px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 15px #10b981; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:bold;">🟢</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const beaconIcon = L.divIcon({
      className: 'custom-beacon-pin',
      html: `<div style="background:#f59e0b; width:28px; height:28px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 15px #f59e0b; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:bold;">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    // Add Incident Pins to Map
    incidentPins.forEach((pin) => {
      const icon = pin.type === 'emergency' ? emergencyIcon : pin.type === 'safe_assembly' ? safeIcon : beaconIcon;
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

      marker.bindTooltip(`<b>${pin.name}</b>`, { permanent: false, direction: 'top' });
      marker.on('click', () => {
        setSelectedPin(pin);
        map.flyTo([pin.lat, pin.lng], 16, { duration: 1.2 });
      });
    });

    // Start Live GPS Geolocation Watcher
    if ('geolocation' in navigator) {
      setIsLocating(true);
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setGpsAccuracy(Math.round(accuracy));
          setIsLocating(false);

          // Update or create Live User GPS Marker
          const userIcon = L.divIcon({
            className: 'live-user-gps-marker',
            html: `<div style="background:#3b82f6; width:32px; height:32px; border-radius:50%; border:4px solid #ffffff; box-shadow:0 0 20px #3b82f6; display:flex; align-items:center; justify-content:center; color:#ffffff; font-weight:black; animation: pulse 2s infinite;">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
            userMarker.bindTooltip('<b>📍 YOUR LIVE REAL-TIME GPS LOCATION</b>', { permanent: true, direction: 'top' });
            userMarkerRef.current = userMarker;
          }
        },
        (error) => {
          console.warn('GPS Geolocation Error:', error.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [incidentPins]);

  // Switch Tile Layer between Satellite and Street Map
  const toggleMapMode = (mode: 'satellite' | 'street') => {
    setMapMode(mode);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newUrl = mode === 'satellite' ? satelliteUrl : streetUrl;

    const newLayer = L.tileLayer(newUrl, {
      attribution: mode === 'satellite' ? '&copy; Esri World Imagery' : '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  };

  // Recenter Map on User's Live GPS Coordinates
  const handleRecenterGps = () => {
    if (userCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 16, { duration: 1.2 });
    } else if (mapInstanceRef.current) {
      // Fallback center
      mapInstanceRef.current.flyTo([21.4392, 83.9745], 15, { duration: 1.2 });
    }
  };

  // Search Location Handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    // Search matching pins
    const matchedPin = incidentPins.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matchedPin) {
      setSelectedPin(matchedPin);
      mapInstanceRef.current.flyTo([matchedPin.lat, matchedPin.lng], 16, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-stone-900/95 border-2 border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-md relative">
      
      {/* Header controls & Map Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-white font-heading">🛰️ REAL-TIME GPS SATELLITE MAP</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/40">
              LIVE GPS TRACKER
            </span>
          </div>
          <p className="text-sm font-extrabold text-stone-300">
            Real-time satellite terrain tiles, browser GPS geolocation tracking, and spatial emergency pins
          </p>
        </div>

        {/* Map Layer Mode Switcher */}
        <div className="flex items-center bg-stone-950 p-1.5 rounded-2xl border-2 border-stone-800 gap-1">
          <button
            onClick={() => toggleMapMode('satellite')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
              mapMode === 'satellite'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border border-orange-400/40'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Satellite className="w-4 h-4 text-orange-400" />
            <span>SATELLITE VIEW</span>
          </button>

          <button
            onClick={() => toggleMapMode('street')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all cursor-pointer ${
              mapMode === 'street'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg border border-orange-400/40'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4 text-cyan-400" />
            <span>STREET MAP</span>
          </button>
        </div>
      </div>

      {/* Location Search Bar & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/90 p-3 rounded-2xl border-2 border-stone-800 text-xs font-extrabold">
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-stone-900 px-3 py-2 rounded-xl border border-stone-700 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-orange-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location (e.g. Budelkani, Hospital, ICU)..."
            className="bg-transparent text-white placeholder-stone-400 text-xs font-bold focus:outline-none w-full"
          />
          <button type="submit" className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-lg cursor-pointer">
            Go
          </button>
        </form>

        {/* Live GPS Telemetry Status */}
        <div className="flex items-center gap-3 text-stone-200">
          <button
            onClick={handleRecenterGps}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 font-black cursor-pointer"
            title="Recenter on Live GPS Location"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-amber-400' : 'text-blue-400'}`} />
            <span>RECENTER GPS</span>
          </button>

          {userCoords && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>GPS LAT: {userCoords.lat.toFixed(4)} | LNG: {userCoords.lng.toFixed(4)} ({gpsAccuracy}m)</span>
            </div>
          )}
        </div>

      </div>

      {/* Leaflet Real-Time Map Viewport */}
      <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl border-2 border-stone-800 overflow-hidden shadow-2xl z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Satellite Map Overlay Badge */}
        <div className="absolute top-4 left-4 bg-stone-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-stone-800 text-xs font-extrabold text-white z-[1000] flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-400" />
          <span>{mapMode === 'satellite' ? 'ESRI SATELLITE TERRAIN TILES' : 'OPENSTREETMAP VECTORS'}</span>
        </div>
      </div>

      {/* Selected Location Inspector Popup */}
      {selectedPin && (
        <div className="bg-stone-950 p-4 rounded-2xl border-2 border-stone-800 flex items-center justify-between gap-4 animate-in fade-in duration-200 shadow-2xl">
          <div className="space-y-1 text-sm">
            <div className="font-black text-amber-400 uppercase text-xs tracking-wider flex items-center gap-2">
              {selectedPin.type === 'emergency' && <Flame className="w-4 h-4 text-red-500" />}
              {selectedPin.type === 'safe_assembly' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {selectedPin.type === 'beacon' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
              <span>{selectedPin.name}</span>
            </div>
            <div className="text-white font-extrabold">
              Coordinates: Lat {selectedPin.lat.toFixed(4)}, Lng {selectedPin.lng.toFixed(4)}
            </div>
            <div className="text-stone-300 font-bold text-xs">
              {selectedPin.details}
            </div>
          </div>
          <button
            onClick={() => setSelectedPin(null)}
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-black hover:bg-stone-700 cursor-pointer border border-stone-700"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};
