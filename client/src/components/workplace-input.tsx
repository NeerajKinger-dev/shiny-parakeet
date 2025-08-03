import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Building, MapPin, Filter, Settings, Home, Bath, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { Workplace, LocalityWithData } from "@shared/schema";

interface WorkplaceInputProps {
  onWorkplaceSelect: (workplace: Workplace | null) => void;
  onRecommendationsChange: (recommendations: LocalityWithData[]) => void;
  selectedWorkplace: Workplace | null;
  onLocalitySelect?: (locality: LocalityWithData) => void;
}

export default function WorkplaceInput({ 
  onWorkplaceSelect, 
  onRecommendationsChange,
  selectedWorkplace,
  onLocalitySelect
}: WorkplaceInputProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [maxPrice, setMaxPrice] = useState<string>("all");
  const [selectedLocality, setSelectedLocality] = useState<LocalityWithData | null>(null);
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);
  
  // Property filter states
  const [bhkFilter, setBhkFilter] = useState<string[]>([]);
  const [bathroomFilter, setBathroomFilter] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([20, 200]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [furnishingFilter, setFurnishingFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [listedByFilter, setListedByFilter] = useState<string[]>([]);
  
  // Fetch all workplaces for initial suggestions
  const { data: allWorkplaces = [] } = useQuery<Workplace[]>({
    queryKey: ['/api/workplaces']
  });

  // Search workplaces when query changes
  const { data: searchResults = [] } = useQuery<Workplace[]>({
    queryKey: ['/api/workplaces/search', query],
    enabled: query.length > 2
  });

  // Get recommendations when workplace is selected
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery<LocalityWithData[]>({
    queryKey: ['/api/recommendations', selectedWorkplace?.id, maxPrice === "all" ? undefined : maxPrice],
    enabled: !!selectedWorkplace
  });

  // Update recommendations when they change
  useEffect(() => {
    onRecommendationsChange(recommendations);
  }, [recommendations, onRecommendationsChange]);

  const displayWorkplaces = query.length > 2 ? searchResults : allWorkplaces.slice(0, 5);

  const handleWorkplaceSelect = (workplace: Workplace) => {
    setQuery(workplace.name);
    setShowSuggestions(false);
    onWorkplaceSelect(workplace);
  };

  const handleClear = () => {
    setQuery("");
    setMaxPrice("all");
    onWorkplaceSelect(null);
    onRecommendationsChange([]);
    setSelectedLocality(null);
  };

  const handleLocalityClick = (locality: LocalityWithData) => {
    setSelectedLocality(locality);
    setShowPropertyFilter(true);
    if (onLocalitySelect) {
      onLocalitySelect(locality);
    }
  };

  const priceOptions = [
    { value: "all", label: "All Price Ranges" },
    { value: "4000", label: "Under ₹4,000/sq ft" },
    { value: "6000", label: "Under ₹6,000/sq ft" },
    { value: "8000", label: "Under ₹8,000/sq ft" },
    { value: "10000", label: "Under ₹10,000/sq ft" },
  ];

  return (
    <div className="space-y-4">
      {/* Workplace Search Input and Price Filter Row */}
      <div className="relative">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Find homes near your office with excellent transit and utilities coverage"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-4"
            />
            {selectedWorkplace && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            )}
          </div>
          
          {/* Price Filter - always visible */}
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Workplace Suggestions */}
        {showSuggestions && displayWorkplaces.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 shadow-lg">
            <CardContent className="p-2">
              {displayWorkplaces.map((workplace) => (
                <div
                  key={workplace.id}
                  onClick={() => handleWorkplaceSelect(workplace)}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md"
                >
                  <Building className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {workplace.name}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {workplace.address}
                    </div>
                    {workplace.description && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {workplace.description}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {workplace.category.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Workplace & Recommendations Summary */}
      {selectedWorkplace && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Recommendations for {selectedWorkplace.name}
              </h3>
              <p className="text-sm text-blue-700">
                {recommendationsLoading ? (
                  "Finding best areas with high transport scores and utility coverage..."
                ) : (
                  `Found ${recommendations.length} recommended areas based on transport access and utilities`
                )}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-blue-600">
              Clear
            </Button>
          </div>
          
          {recommendations.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-blue-600 font-medium">Top recommendations:</div>
              <div className="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map((locality) => (
                  <Badge 
                    key={locality.id} 
                    variant="outline" 
                    className="text-xs bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => handleLocalityClick(locality)}
                  >
                    {locality.name} ({Math.round(locality.distance || 0)}km)
                  </Badge>
                ))}
                {recommendations.length > 3 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className="text-xs bg-white cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                        +{recommendations.length - 3} more
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl z-[9999]" style={{ zIndex: 9999 }}>
                      <DialogHeader>
                        <DialogTitle>All Recommendations for {selectedWorkplace.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {recommendations.map((locality) => (
                          <div
                            key={locality.id}
                            onClick={() => handleLocalityClick(locality)}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <div className="font-medium text-sm">{locality.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(locality.distance || 0)}km from office
                            </div>
                            {locality.propertyData && (
                              <div className="text-xs text-gray-600 mt-1">
                                Transport: {locality.propertyData.transportScore}/10 • 
                                Utilities: {locality.propertyData.utilityCoverage}/10
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Property Filter Dialog */}
      <Dialog open={showPropertyFilter} onOpenChange={setShowPropertyFilter}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Search in {selectedLocality?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BHK Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Bedrooms (BHK)
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={bhkFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBhkFilter([...bhkFilter, option]);
                        } else {
                          setBhkFilter(bhkFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Bathrooms
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {['1 Bathroom', '2 Bathrooms', '3 Bathrooms'].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={bathroomFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBathroomFilter([...bathroomFilter, option]);
                        } else {
                          setBathroomFilter(bathroomFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Budget Range
              </Label>
              <div className="space-y-3">
                <Slider
                  value={budgetRange}
                  onValueChange={(value) => setBudgetRange(value as [number, number])}
                  max={500}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{budgetRange[0]} Lakhs</span>
                  <span>₹{budgetRange[1]} Lakhs</span>
                </div>
                <div className="text-center text-xs text-gray-500">
                  Budget: ₹{budgetRange[0]}L - ₹{budgetRange[1]}L
                </div>
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Property Type</Label>
              <div className="space-y-2">
                {[
                  'Flats / Apartments (466)',
                  'House & Villa (379)', 
                  'Farm House (6)',
                  'Independent / Builder Floors (38)'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={typeFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTypeFilter([...typeFilter, option]);
                        } else {
                          setTypeFilter(typeFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Furnishing Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Furnishing</Label>
              <div className="space-y-2">
                {[
                  'Furnished (49)',
                  'Unfurnished (165)',
                  'Semi-Furnished (657)'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={furnishingFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFurnishingFilter([...furnishingFilter, option]);
                        } else {
                          setFurnishingFilter(furnishingFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Project Status</Label>
              <div className="space-y-2">
                {[
                  'Under Construction (20)',
                  'Ready to Move (815)',
                  'New Launch (15)'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={statusFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, option]);
                        } else {
                          setStatusFilter(statusFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Listed by Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Listed by</Label>
              <div className="space-y-2">
                {[
                  'Owner (203)',
                  'Dealer (476)',
                  'Builder (195)'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={listedByFilter.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setListedByFilter([...listedByFilter, option]);
                        } else {
                          setListedByFilter(listedByFilter.filter(item => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-xs">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => {
              setBhkFilter([]);
              setBathroomFilter([]);
              setBudgetRange([20, 200]);
              setTypeFilter([]);
              setFurnishingFilter([]);
              setStatusFilter([]);
              setListedByFilter([]);
            }}>
              Clear All Filters
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPropertyFilter(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Here you would typically apply the filters and navigate to properties page
                setShowPropertyFilter(false);
                // For now, just show an alert with selected filters
                const activeFilters = {
                  bhk: bhkFilter,
                  bathrooms: bathroomFilter,
                  budget: `₹${budgetRange[0]}L - ₹${budgetRange[1]}L`,
                  type: typeFilter,
                  furnishing: furnishingFilter,
                  status: statusFilter,
                  listedBy: listedByFilter
                };
                console.log('Applied filters:', activeFilters);
              }}>
                Search Properties
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}