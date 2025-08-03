import { useState } from "react";
import AppHeader from "@/components/layout/app-header";
import Sidebar from "@/components/layout/sidebar";
import MapView from "@/components/map/map-view";
import WorkplaceInput from "@/components/workplace-input";
import type { Workplace, LocalityWithData } from "@shared/schema";

export default function Dashboard() {
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [selectedPriceLayer, setSelectedPriceLayer] = useState<string>("residential_prices");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(null);
  const [recommendations, setRecommendations] = useState<LocalityWithData[]>([]);

  const handleLayerToggle = (layer: string) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  const handlePriceLayerChange = (layer: string) => {
    setSelectedPriceLayer(layer);
  };

  const handleWorkplaceSelect = (workplace: Workplace | null) => {
    setSelectedWorkplace(workplace);
  };

  const handleRecommendationsChange = (newRecommendations: LocalityWithData[]) => {
    setRecommendations(newRecommendations);
  };

  const handleLocalitySelect = (locality: LocalityWithData) => {
    // Focus the map on the selected locality
    // This will be handled by the MapView component
  };

  // Combine price layer and infrastructure layers for map view
  const allActiveLayers = [
    ...(selectedPriceLayer !== 'none' ? [selectedPriceLayer] : []),
    ...activeLayers
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Workplace Input Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <WorkplaceInput
          onWorkplaceSelect={handleWorkplaceSelect}
          onRecommendationsChange={handleRecommendationsChange}
          selectedWorkplace={selectedWorkplace}
          onLocalitySelect={handleLocalitySelect}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeLayers={activeLayers} 
          onLayerToggle={handleLayerToggle}
          selectedPriceLayer={selectedPriceLayer}
          onPriceLayerChange={handlePriceLayerChange}
        />
        <MapView 
          activeLayers={allActiveLayers}
          searchQuery={searchQuery}
          selectedWorkplace={selectedWorkplace}
          recommendations={recommendations}
        />
      </div>
    </div>
  );
}
