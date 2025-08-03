
import { useState } from "react";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

interface MobileSidebarProps {
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
  selectedPriceLayer: string;
  onPriceLayerChange: (layer: string) => void;
}

export default function MobileSidebar({ 
  activeLayers, 
  onLayerToggle, 
  selectedPriceLayer, 
  onPriceLayerChange 
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-border"
        >
          <Layers className="w-4 h-4 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle>Map Controls</SheetTitle>
        </SheetHeader>
        <div className="h-full overflow-hidden">
          <Sidebar 
            activeLayers={activeLayers}
            onLayerToggle={onLayerToggle}
            selectedPriceLayer={selectedPriceLayer}
            onPriceLayerChange={onPriceLayerChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
