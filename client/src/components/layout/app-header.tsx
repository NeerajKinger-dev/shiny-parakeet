import { Search, Bell, Settings, ChevronRight, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3v18h18V9l-8-6-10 6v12zm8 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Insight Realty</h1>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                Analytics
              </Button>
            </Link>
            <Link href="/properties">
              <Button 
                variant={location === "/properties" ? "default" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Properties
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Search localities in North Bangalore..."
              className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
