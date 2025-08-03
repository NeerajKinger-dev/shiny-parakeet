import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Calendar, Home, IndianRupee, Star } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import type { PropertyWithDeveloper, Developer } from "@shared/schema";

export default function Properties() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<PropertyWithDeveloper[]>({
    queryKey: ['/api/properties']
  });

  const { data: developers = [], isLoading: developersLoading } = useQuery<Developer[]>({
    queryKey: ['/api/developers']
  });

  // Filter properties based on selected developer and search query
  const filteredProperties = properties.filter(property => {
    const matchesDeveloper = selectedDeveloper === "all" || property.developerId === selectedDeveloper;
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.locality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.developer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDeveloper && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_to_move': return 'bg-green-500';
      case 'under_construction': return 'bg-yellow-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready_to_move': return 'Ready to Move';
      case 'under_construction': return 'Under Construction';
      case 'upcoming': return 'Upcoming';
      default: return status;
    }
  };

  if (propertiesLoading || developersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Showcase</h1>
          <p className="text-gray-600">Discover premium properties from leading developers in North Bangalore</p>
        </div>

        {/* Developer showcase section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Developers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {developers.map((developer) => (
              <Card key={developer.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-sm">{developer.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{developer.totalProjects} Projects</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search properties, locations, or developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Developer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Developers</SelectItem>
              {developers.map((developer) => (
                <SelectItem key={developer.id} value={developer.id}>
                  {developer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getStatusColor(property.status)} text-white`}>
                    {getStatusText(property.status)}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 3}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{property.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {property.developer.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {property.locality.name}
                </div>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <IndianRupee className="h-4 w-4" />
                  {property.priceRange}
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {property.bedrooms}
                    </div>
                  )}
                  <div>{property.size}</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {property.status === 'ready_to_move' 
                    ? `Ready: ${property.possessionDate}`
                    : `Launch: ${property.launchDate}`
                  }
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}