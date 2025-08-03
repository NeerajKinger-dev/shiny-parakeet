import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, Calendar, Home, IndianRupee, Star, Search } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import type { PropertyWithDeveloper, Developer } from "@shared/schema";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background">
      <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Properties</h1>
          <p className="text-muted-foreground text-sm md:text-base">Discover premium properties from trusted developers in North Bangalore</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search Properties</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filter by Developer</label>
              <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                <SelectTrigger>
                  <SelectValue placeholder="All Developers" />
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

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDeveloper("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg font-semibold text-foreground mb-1 truncate">
                      {property.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.locality.name}</span>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getStatusText(property.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span className="text-sm">Starting from</span>
                    </div>
                    <span className="text-base md:text-lg font-bold text-foreground">
                      ₹{property.priceRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Home className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} units</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{property.launchDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground min-w-0 flex-1">
                        <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">by {property.developer?.name}</span>
                      </div>
                      <div className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">4.{Math.floor(Math.random() * 5) + 3}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}