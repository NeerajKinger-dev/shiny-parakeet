import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all localities with property data
  app.get("/api/localities", async (req, res) => {
    try {
      const localities = await storage.getLocalitiesWithData();
      res.json(localities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch localities" });
    }
  });

  // Get locality by ID
  app.get("/api/localities/:id", async (req, res) => {
    try {
      const locality = await storage.getLocalityById(req.params.id);
      if (!locality) {
        return res.status(404).json({ message: "Locality not found" });
      }
      const propertyData = await storage.getPropertyDataByLocalityId(locality.id);
      const heatmapData = await storage.getHeatmapDataByLocalityId(locality.id);
      
      res.json({
        ...locality,
        propertyData,
        heatmapData
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locality" });
    }
  });

  // Get heatmap data by type
  app.get("/api/heatmap/:dataType", async (req, res) => {
    try {
      const { dataType } = req.params;
      const validTypes = ['residential_prices', 'commercial_prices', 'transport', 'utilities', 'roads'];
      
      if (!validTypes.includes(dataType)) {
        return res.status(400).json({ message: "Invalid data type" });
      }

      const heatmapData = await storage.getHeatmapData(dataType);
      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heatmap data" });
    }
  });

  // Search localities
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }

      const localities = await storage.getLocalitiesWithData();
      const filteredLocalities = localities.filter(locality =>
        locality.name.toLowerCase().includes(q.toLowerCase())
      );

      res.json(filteredLocalities);
    } catch (error) {
      res.status(500).json({ message: "Failed to search localities" });
    }
  });

  // Get statistics for North Bangalore
  app.get("/api/statistics", async (req, res) => {
    try {
      const localities = await storage.getLocalitiesWithData();
      
      let totalResidential = 0;
      let totalCommercial = 0;
      let totalTransport = 0;
      let totalUtility = 0;
      let totalListings = 0;
      let count = 0;

      localities.forEach(locality => {
        if (locality.propertyData) {
          totalResidential += locality.propertyData.residentialPricePerSqft || 0;
          totalCommercial += locality.propertyData.commercialPricePerSqft || 0;
          totalTransport += parseFloat(locality.propertyData.transportScore || "0");
          totalUtility += locality.propertyData.utilityCoverage || 0;
          totalListings += locality.propertyData.totalListings || 0;
          count++;
        }
      });

      const statistics = {
        avgResidentialPrice: count > 0 ? Math.round(totalResidential / count) : 0,
        avgCommercialPrice: count > 0 ? Math.round(totalCommercial / count) : 0,
        avgTransportScore: count > 0 ? Math.round((totalTransport / count) * 10) / 10 : 0,
        avgUtilityCoverage: count > 0 ? Math.round(totalUtility / count) : 0,
        totalListings,
        totalLocalities: count
      };

      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Developer routes
  app.get("/api/developers", async (req, res) => {
    try {
      const developers = await storage.getDevelopers();
      res.json(developers);
    } catch (error) {
      console.error("Error fetching developers:", error);
      res.status(500).json({ error: "Failed to fetch developers" });
    }
  });

  app.get("/api/developers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const developer = await storage.getDeveloperById(id);
      
      if (!developer) {
        return res.status(404).json({ error: "Developer not found" });
      }
      
      res.json(developer);
    } catch (error) {
      console.error("Error fetching developer:", error);
      res.status(500).json({ error: "Failed to fetch developer" });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { developer, locality } = req.query;
      
      let properties;
      if (developer) {
        properties = await storage.getPropertiesByDeveloper(developer as string);
      } else if (locality) {
        properties = await storage.getPropertiesByLocality(locality as string);
      } else {
        properties = await storage.getPropertiesWithDeveloper();
      }
      
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // Workplace routes
  app.get("/api/workplaces", async (req, res) => {
    try {
      const workplaces = await storage.getWorkplaces();
      res.json(workplaces);
    } catch (error) {
      console.error("Error fetching workplaces:", error);
      res.status(500).json({ error: "Failed to fetch workplaces" });
    }
  });

  app.get("/api/workplaces/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query required" });
      }

      const workplaces = await storage.searchWorkplaces(q);
      res.json(workplaces);
    } catch (error) {
      console.error("Error searching workplaces:", error);
      res.status(500).json({ error: "Failed to search workplaces" });
    }
  });

  app.get("/api/recommendations/:workplaceId", async (req, res) => {
    try {
      const { workplaceId } = req.params;
      const { maxPrice } = req.query;
      
      const maxPricePerSqft = maxPrice ? parseInt(maxPrice as string) : undefined;
      const recommendations = await storage.getRecommendedLocalities(workplaceId, maxPricePerSqft);
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
