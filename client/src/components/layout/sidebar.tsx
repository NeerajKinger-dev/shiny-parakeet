import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarProps {
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
  selectedPriceLayer: string;
  onPriceLayerChange: (layer: string) => void;
}

const priceLayerOptions = [
  { value: "none", label: "No Price Layer" },
  { value: "residential_prices", label: "Residential Land Prices" },
  { value: "commercial_prices", label: "Commercial Land Prices" },
];

const infrastructureLayerOptions = [
  { value: "buses", label: "Bus Coverage" },
  { value: "metros", label: "Metro Coverage" }, 
  { value: "ev_charging", label: "EV Charging Stations" },
  { value: "utilities", label: "Water & Sewerage" },
  { value: "roads", label: "Road Access Quality" },
];

const legends = {
  residential_prices: [
    { color: "bg-red-500", label: "₹8,000+ (Premium)" },
    { color: "bg-orange-400", label: "₹6,000-8,000 (High)" },
    { color: "bg-yellow-400", label: "₹4,000-6,000 (Medium)" },
    { color: "bg-lime-400", label: "₹2,000-4,000 (Low)" },
    { color: "bg-green-500", label: "₹0-2,000 (Budget)" },
  ],
  commercial_prices: [
    { color: "bg-red-500", label: "₹20,000+ (Premium)" },
    { color: "bg-orange-400", label: "₹15,000-20,000 (High)" },
    { color: "bg-yellow-400", label: "₹10,000-15,000 (Medium)" },
    { color: "bg-lime-400", label: "₹5,000-10,000 (Low)" },
    { color: "bg-green-500", label: "₹0-5,000 (Budget)" },
  ],
  buses: [
    { color: "bg-blue-500", label: "Excellent (9-10)" },
    { color: "bg-blue-400", label: "Good (7-8.9)" },
    { color: "bg-blue-300", label: "Average (5-6.9)" },
    { color: "bg-blue-200", label: "Poor (3-4.9)" },
    { color: "bg-blue-100", label: "Very Poor (0-2.9)" },
  ],
  metros: [
    { color: "bg-teal-500", label: "Excellent (9-10)" },
    { color: "bg-teal-400", label: "Good (7-8.9)" },
    { color: "bg-teal-300", label: "Average (5-6.9)" },
    { color: "bg-teal-200", label: "Poor (3-4.9)" },
    { color: "bg-teal-100", label: "Very Poor (0-2.9)" },
  ],
  ev_charging: [
    { color: "bg-emerald-500", label: "High Density (10+ stations)" },
    { color: "bg-emerald-400", label: "Good Coverage (6-9 stations)" },
    { color: "bg-emerald-300", label: "Moderate (3-5 stations)" },
    { color: "bg-emerald-200", label: "Limited (1-2 stations)" },
    { color: "bg-emerald-100", label: "No Coverage" },
  ],
  utilities: [
    { color: "bg-purple-500", label: "95-100% Coverage" },
    { color: "bg-purple-400", label: "85-94% Coverage" },
    { color: "bg-purple-300", label: "75-84% Coverage" },
    { color: "bg-purple-200", label: "60-74% Coverage" },
    { color: "bg-purple-100", label: "Below 60% Coverage" },
  ],
  roads: [
    { color: "bg-green-500", label: "Excellent (9-10)" },
    { color: "bg-green-400", label: "Good (7-8.9)" },
    { color: "bg-yellow-400", label: "Average (5-6.9)" },
    { color: "bg-orange-400", label: "Poor (3-4.9)" },
    { color: "bg-red-400", label: "Very Poor (0-2.9)" },
  ],
};

const legendTitles = {
  residential_prices: "Residential Prices (₹/sq ft)",
  commercial_prices: "Commercial Prices (₹/sq ft)",
  transport: "Transport Access Score",
  utilities: "Utility Coverage",
  roads: "Road Quality Score",
};

export default function Sidebar({ activeLayers, onLayerToggle, selectedPriceLayer, onPriceLayerChange }: SidebarProps) {
  const { data: statistics } = useQuery<{
    avgResidentialPrice: number;
    avgCommercialPrice: number;
    avgTransportScore: number;
    avgUtilityCoverage: number;
    totalListings: number;
    totalLocalities: number;
  }>({
    queryKey: ["/api/statistics"],
  });

  return (
    <aside className="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Layer Controls */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Map Layers</h2>
        
        {/* Price Layer Dropdown */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Land Prices</Label>
          <Select value={selectedPriceLayer} onValueChange={onPriceLayerChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select price layer" />
            </SelectTrigger>
            <SelectContent>
              {priceLayerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Infrastructure Layer Checkboxes */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Infrastructure & Services</Label>
          <div className="space-y-3">
            {infrastructureLayerOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <Checkbox 
                  id={option.value}
                  checked={activeLayers.includes(option.value)}
                  onCheckedChange={() => onLayerToggle(option.value)}
                  className="text-primary"
                />
                <Label htmlFor={option.value} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Layers</h3>
        <div className="space-y-4">
          {/* Price Layer Legend */}
          {selectedPriceLayer && selectedPriceLayer !== 'none' && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                {legendTitles[selectedPriceLayer as keyof typeof legendTitles]}
              </h4>
              <div className="space-y-1">
                {legends[selectedPriceLayer as keyof typeof legends].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${item.color} rounded`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Infrastructure Layers Legend - Clickable */}
          {activeLayers.map((layerKey) => {
            const legend = legends[layerKey as keyof typeof legends];
            const title = legendTitles[layerKey as keyof typeof legendTitles];
            return (
              <div key={layerKey} className="group">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">{title}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                    onClick={() => onLayerToggle(layerKey)}
                    title="Remove layer"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {legend.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${item.color} rounded`}></div>
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {activeLayers.length === 0 && (!selectedPriceLayer || selectedPriceLayer === 'none') && (
            <p className="text-xs text-gray-500">Select layers to see legend</p>
          )}
        </div>
      </div>

      {/* Area Statistics */}
      <div className="p-6 flex-1 overflow-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Area Statistics</h3>
        
        {statistics && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Average Residential Price</div>
              <div className="text-lg font-semibold text-gray-900">₹{statistics.avgResidentialPrice.toLocaleString()}/sq ft</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                12.3% vs last quarter
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Average Commercial Price</div>
              <div className="text-lg font-semibold text-gray-900">₹{statistics.avgCommercialPrice.toLocaleString()}/sq ft</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Total Listings</div>
              <div className="text-lg font-semibold text-gray-900">{statistics.totalListings.toLocaleString()}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Transport Score</div>
              <div className="text-lg font-semibold text-green-600">{statistics.avgTransportScore}/10</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Utility Coverage</div>
              <div className="text-lg font-semibold text-blue-600">{statistics.avgUtilityCoverage}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="p-6 border-t border-gray-200">
        <Button className="w-full bg-primary text-white hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Map</span>
        </Button>
      </div>
    </aside>
  );
}
