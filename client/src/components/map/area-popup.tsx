import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocalityWithData } from "@shared/schema";

interface AreaPopupProps {
  locality: LocalityWithData;
  onClose: () => void;
}

export default function AreaPopup({ locality, onClose }: AreaPopupProps) {
  const { propertyData } = locality;

  const getTransportAccessLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Average";
    return "Poor";
  };

  const getTransportAccessColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 max-w-xs z-[2000] border">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-semibold text-gray-900">{locality.name}</h5>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {propertyData ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Residential Rate:</span>
            <span className="font-medium">₹{propertyData.residentialPricePerSqft?.toLocaleString()}/sqft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Commercial Rate:</span>
            <span className="font-medium">₹{propertyData.commercialPricePerSqft?.toLocaleString()}/sqft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transport Access:</span>
            <span className={`font-medium ${getTransportAccessColor(parseFloat(propertyData.transportScore || "0"))}`}>
              {getTransportAccessLabel(parseFloat(propertyData.transportScore || "0"))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Utility Coverage:</span>
            <span className="font-medium text-blue-600">{propertyData.utilityCoverage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Listings:</span>
            <span className="font-medium">{propertyData.totalListings}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No property data available</div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <Button 
          variant="link" 
          className="text-primary text-sm font-medium hover:text-blue-700 p-0 h-auto"
        >
          View Detailed Report <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
