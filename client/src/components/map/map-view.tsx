import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import { Plus, Minus, Maximize2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import AreaPopup from "./area-popup";
import type { LocalityWithData, Workplace } from "@shared/schema";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";

const DefaultIcon = L.divIcon({
  html: `<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  className: 'custom-div-icon'
});

const WorkplaceIcon = L.divIcon({
  html: `<div style="background-color: #EF4444; width: 16px; height: 16px; border-radius: 3px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">🏢</div>`,
  iconSize: [20, 20],
  className: 'workplace-icon'
});

const RecommendationIcon = L.divIcon({
  html: `<div style="background-color: #10B981; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #34D399; box-shadow: 0 2px 6px rgba(16,185,129,0.4);"></div>`,
  iconSize: [20, 20],
  className: 'recommendation-icon'
});

interface MapViewProps {
  activeLayers: string[];
  searchQuery: string;
  selectedWorkplace?: Workplace | null;
  recommendations?: LocalityWithData[];
}

// Heatmap component that uses the map instance
function HeatmapLayer({ data, activeLayers }: { data: LocalityWithData[], activeLayers: string[] }) {
  const map = useMap();
  const heatmapRef = useRef<any>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear existing heatmap
    if (heatmapRef.current) {
      map.removeLayer(heatmapRef.current);
    }

    if (activeLayers.length === 0) return;

    // Create layer group for all active layers
    heatmapRef.current = L.layerGroup().addTo(map);

    // Create separate circles for each active layer with offset positions to avoid overlap
    data.forEach(locality => {
      if (locality.propertyData) {
        const baseLat = parseFloat(locality.latitude);
        const baseLng = parseFloat(locality.longitude);
        
        activeLayers.forEach((activeLayer, layerIndex) => {
          let intensity = 0.5;
          
          switch (activeLayer) {
            case 'residential_prices':
              intensity = Math.min((locality.propertyData!.residentialPricePerSqft || 0) / 10000, 1);
              break;
            case 'commercial_prices':
              intensity = Math.min((locality.propertyData!.commercialPricePerSqft || 0) / 20000, 1);
              break;
            case 'transport':
              intensity = parseFloat(locality.propertyData!.transportScore || "0") / 10;
              break;
            case 'utilities':
              intensity = (locality.propertyData!.utilityCoverage || 0) / 100;
              break;
            case 'roads':
              intensity = parseFloat(locality.propertyData!.roadQualityScore || "0") / 10;
              break;
          }

          // Offset each layer to prevent overlapping - circular arrangement
          const angleOffset = (layerIndex * 2 * Math.PI) / activeLayers.length;
          const offsetDistance = 0.005; // Small offset in degrees
          const lat = baseLat + Math.cos(angleOffset) * offsetDistance;
          const lng = baseLng + Math.sin(angleOffset) * offsetDistance;

          const color = getColorForIntensity(intensity, activeLayer);
          const circle = L.circle([lat, lng], {
            radius: intensity * 1500, // Smaller radius to prevent overlap
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.5
          });
          
          heatmapRef.current!.addLayer(circle);
        });
      }
    });

    return () => {
      if (heatmapRef.current) {
        map.removeLayer(heatmapRef.current);
      }
    };
  }, [map, data, activeLayers]);

  return null;
}

function getColorForIntensity(intensity: number, layer: string): string {
  const colors = {
    residential_prices: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
    commercial_prices: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
    buses: ['#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6'],
    metros: ['#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6'],
    ev_charging: ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e'],
    transport: ['#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6'],
    utilities: ['#e9d5ff', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'],
    roads: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
  };

  const colorSet = colors[layer as keyof typeof colors] || colors.residential_prices;
  const index = Math.min(Math.floor(intensity * colorSet.length), colorSet.length - 1);
  return colorSet[index];
}

export default function MapView({ activeLayers, searchQuery, selectedWorkplace, recommendations = [] }: MapViewProps) {
  const [selectedLocality, setSelectedLocality] = useState<LocalityWithData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef<L.Map>(null);

  const { data: localities = [] } = useQuery<LocalityWithData[]>({
    queryKey: ["/api/localities"],
  });

  const filteredLocalities = localities.filter(locality =>
    searchQuery === "" || locality.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const northBangaloreCenter: [number, number] = [13.0358, 77.5970]; // Hebbal coordinates

  const handleLocalityClick = (locality: LocalityWithData) => {
    setSelectedLocality(locality);
    setShowPopup(true);
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(northBangaloreCenter, 11);
    }
  };

  return (
    <main className="flex-1 relative">
      <div className="w-full h-full relative overflow-hidden bg-gray-100">
        <MapContainer
          center={northBangaloreCenter}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <HeatmapLayer data={filteredLocalities} activeLayers={activeLayers} />
          
          {/* Locality markers */}
          {filteredLocalities.map((locality) => {
            const position: [number, number] = [parseFloat(locality.latitude), parseFloat(locality.longitude)];
            const isRecommended = recommendations.some(rec => rec.id === locality.id);
            
            return (
              <Marker
                key={locality.id}
                position={position}
                icon={isRecommended ? RecommendationIcon : DefaultIcon}
                eventHandlers={{
                  click: () => handleLocalityClick(locality)
                }}
              />
            );
          })}

          {/* Workplace marker */}
          {selectedWorkplace && (
            <Marker
              position={[parseFloat(selectedWorkplace.latitude), parseFloat(selectedWorkplace.longitude)]}
              icon={WorkplaceIcon}
              eventHandlers={{
                click: () => {
                  setSelectedLocality(null);
                  setShowPopup(false);
                }
              }}
            />
          )}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-background/90 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-border"
            onClick={zoomIn}
          >
            <Plus className="w-4 h-4 text-foreground" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-background/90 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-border"
            onClick={zoomOut}
          >
            <Minus className="w-4 h-4 text-foreground" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-background/90 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-border"
            onClick={resetView}
          >
            <Maximize2 className="w-4 h-4 text-foreground" />
          </Button>
        </div>

        {/* Quick Stats Overlay - Hidden on mobile to save space */}
        <div className="hidden md:block absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm z-[1000] border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">North Bangalore Overview</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Active Layers</div>
              <div className="font-semibold text-foreground capitalize">
                {activeLayers.length > 0 ? activeLayers.map(layer => layer.replace('_', ' ')).join(', ') : 'None'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Areas</div>
              <div className="font-semibold text-foreground">{filteredLocalities.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Area Info Popup */}
      {showPopup && selectedLocality && (
        <AreaPopup
          locality={selectedLocality}
          onClose={() => setShowPopup(false)}
        />
      )}
    </main>
  );
}
