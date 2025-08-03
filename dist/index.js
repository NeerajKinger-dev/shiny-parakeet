// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  localities;
  propertyData;
  heatmapData;
  developers;
  properties;
  workplaces;
  constructor() {
    this.localities = /* @__PURE__ */ new Map();
    this.propertyData = /* @__PURE__ */ new Map();
    this.heatmapData = /* @__PURE__ */ new Map();
    this.developers = /* @__PURE__ */ new Map();
    this.properties = /* @__PURE__ */ new Map();
    this.workplaces = /* @__PURE__ */ new Map();
    this.initializeData();
  }
  async initializeData() {
    const localityData = [
      { name: "Yelahanka", latitude: "13.1007", longitude: "77.5963" },
      { name: "Devanahalli", latitude: "13.2519", longitude: "77.7018" },
      { name: "Hebbal", latitude: "13.0358", longitude: "77.5970" },
      { name: "Jakkur", latitude: "13.0837", longitude: "77.6648" },
      { name: "Sahakara Nagar", latitude: "13.0173", longitude: "77.5848" },
      { name: "RT Nagar", latitude: "13.0127", longitude: "77.5934" },
      { name: "Hennur", latitude: "13.0417", longitude: "77.6417" },
      { name: "Banaswadi", latitude: "13.0117", longitude: "77.6648" }
    ];
    for (const locality of localityData) {
      const localityId = randomUUID();
      const loc = {
        id: localityId,
        region: "North Bangalore",
        name: locality.name,
        latitude: locality.latitude,
        longitude: locality.longitude
      };
      this.localities.set(localityId, loc);
      const propData = {
        id: randomUUID(),
        localityId,
        residentialPricePerSqft: Math.floor(Math.random() * 8e3) + 2e3,
        commercialPricePerSqft: Math.floor(Math.random() * 12e3) + 8e3,
        transportScore: (Math.floor(Math.random() * 40) + 60).toString(),
        utilityCoverage: Math.floor(Math.random() * 30) + 70,
        roadQualityScore: (Math.floor(Math.random() * 30) + 70).toString(),
        totalListings: Math.floor(Math.random() * 500) + 100,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.propertyData.set(propData.id, propData);
      const dataTypes = ["residential_prices", "commercial_prices", "transport", "utilities", "roads"];
      for (const dataType of dataTypes) {
        const intensity = Math.floor(Math.random() * 100);
        const coordinates = this.generateHeatmapCoordinates(parseFloat(locality.latitude), parseFloat(locality.longitude));
        const heatData = {
          id: randomUUID(),
          localityId,
          dataType,
          intensity: intensity.toString(),
          coordinates
        };
        this.heatmapData.set(heatData.id, heatData);
      }
    }
    this.initializeDevelopers();
    this.initializeProperties();
    this.initializeWorkplaces();
  }
  async initializeDevelopers() {
    const developersData = [
      {
        name: "Sobha Limited",
        description: "Premium residential and commercial developments",
        establishedYear: 1995,
        totalProjects: 150,
        website: "https://www.sobha.com"
      },
      {
        name: "Brigade Group",
        description: "Integrated real estate development company",
        establishedYear: 1986,
        totalProjects: 200,
        website: "https://www.brigade.co.in"
      },
      {
        name: "Century Real Estate",
        description: "Trusted name in residential and commercial projects",
        establishedYear: 1973,
        totalProjects: 120,
        website: "https://www.centuryrealestate.in"
      },
      {
        name: "Provident Housing",
        description: "Quality homes at affordable prices",
        establishedYear: 2008,
        totalProjects: 80,
        website: "https://www.providenthousing.com"
      },
      {
        name: "Prestige Group",
        description: "Leading real estate developer in South India",
        establishedYear: 1986,
        totalProjects: 250,
        website: "https://www.prestigeconstructions.com"
      }
    ];
    for (const devData of developersData) {
      const developerId = randomUUID();
      const developer = {
        id: developerId,
        logo: null,
        ...devData
      };
      this.developers.set(developerId, developer);
    }
  }
  async initializeProperties() {
    const localities = Array.from(this.localities.values());
    const developers = Array.from(this.developers.values());
    const propertyTypes = ["apartment", "villa", "commercial", "plot"];
    const statuses = ["upcoming", "under_construction", "ready_to_move"];
    const bedroomsOptions = ["1 BHK", "2 BHK", "3 BHK", "2-3 BHK", "3-4 BHK", "4-5 BHK"];
    const commonAmenities = [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "Children's Play Area",
      "Security",
      "Power Backup",
      "Parking",
      "Garden",
      "Jogging Track"
    ];
    for (const developer of developers) {
      for (let i = 0; i < 3; i++) {
        const locality = localities[Math.floor(Math.random() * localities.length)];
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const propertyId = randomUUID();
        const property = {
          id: propertyId,
          name: `${developer.name.split(" ")[0]} ${locality.name} ${propertyType === "apartment" ? "Heights" : propertyType === "villa" ? "Villas" : propertyType === "commercial" ? "Plaza" : "Plots"}`,
          developerId: developer.id,
          localityId: locality.id,
          propertyType,
          priceRange: propertyType === "apartment" ? "\u20B945L - \u20B91.2Cr" : propertyType === "villa" ? "\u20B91.5Cr - \u20B93.5Cr" : propertyType === "commercial" ? "\u20B980L - \u20B92Cr" : "\u20B925L - \u20B960L",
          size: propertyType === "apartment" ? "800-1800 sq ft" : propertyType === "villa" ? "1800-3500 sq ft" : propertyType === "commercial" ? "500-2000 sq ft" : "1200-2400 sq ft",
          bedrooms: propertyType === "commercial" || propertyType === "plot" ? null : bedroomsOptions[Math.floor(Math.random() * bedroomsOptions.length)],
          status,
          launchDate: status === "upcoming" ? "2024-Q4" : "2024-Q2",
          possessionDate: status === "ready_to_move" ? "Immediate" : "2025-Q3",
          amenities: commonAmenities.slice(0, Math.floor(Math.random() * 6) + 3),
          images: [],
          latitude: (parseFloat(locality.latitude) + (Math.random() - 0.5) * 0.01).toString(),
          longitude: (parseFloat(locality.longitude) + (Math.random() - 0.5) * 0.01).toString(),
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.properties.set(propertyId, property);
      }
    }
  }
  async initializeWorkplaces() {
    const workplacesData = [
      {
        name: "Manyata Tech Park",
        address: "Nagawara, Bengaluru, Karnataka 560045",
        latitude: "13.0387",
        longitude: "77.6200",
        category: "tech_park",
        description: "One of the largest tech parks in Bangalore with major IT companies"
      },
      {
        name: "Kirloskar Business Park",
        address: "Hebbal, Bengaluru, Karnataka 560024",
        latitude: "13.0359",
        longitude: "77.5890",
        category: "business_park",
        description: "Premium business park in Hebbal with modern office facilities"
      },
      {
        name: "Embassy Tech Village",
        address: "Outer Ring Road, Devarabisanahalli, Bengaluru, Karnataka 560103",
        latitude: "12.9606",
        longitude: "77.6976",
        category: "tech_park",
        description: "Large tech campus on Outer Ring Road"
      },
      {
        name: "Prestige Tech Park",
        address: "Sarjapur Road, Bengaluru, Karnataka 560035",
        latitude: "12.9081",
        longitude: "77.6933",
        category: "tech_park",
        description: "Modern tech park on Sarjapur Road"
      },
      {
        name: "RMZ Infinity",
        address: "Old Madras Road, Bengaluru, Karnataka 560016",
        latitude: "12.9851",
        longitude: "77.6910",
        category: "office_complex",
        description: "Premium office complex on Old Madras Road"
      }
    ];
    for (const workplaceData of workplacesData) {
      const workplaceId = randomUUID();
      const workplace = {
        id: workplaceId,
        ...workplaceData
      };
      this.workplaces.set(workplaceId, workplace);
    }
  }
  generateHeatmapCoordinates(centerLat, centerLng) {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      const intensity = Math.random();
      points.push([centerLat + latOffset, centerLng + lngOffset, intensity]);
    }
    return points;
  }
  async getLocalities() {
    return Array.from(this.localities.values());
  }
  async getLocalityById(id) {
    return this.localities.get(id);
  }
  async createLocality(insertLocality) {
    const id = randomUUID();
    const locality = { ...insertLocality, id };
    this.localities.set(id, locality);
    return locality;
  }
  async getPropertyData() {
    return Array.from(this.propertyData.values());
  }
  async getPropertyDataByLocalityId(localityId) {
    return Array.from(this.propertyData.values()).find((data) => data.localityId === localityId);
  }
  async createPropertyData(insertData) {
    const id = randomUUID();
    const data = {
      ...insertData,
      id,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.propertyData.set(id, data);
    return data;
  }
  async getHeatmapData(dataType) {
    const allData = Array.from(this.heatmapData.values());
    return dataType ? allData.filter((data) => data.dataType === dataType) : allData;
  }
  async getHeatmapDataByLocalityId(localityId) {
    return Array.from(this.heatmapData.values()).filter((data) => data.localityId === localityId);
  }
  async createHeatmapData(insertData) {
    const id = randomUUID();
    const data = { ...insertData, id };
    this.heatmapData.set(id, data);
    return data;
  }
  async getLocalitiesWithData() {
    const localities = await this.getLocalities();
    const result = [];
    for (const locality of localities) {
      const propertyData = await this.getPropertyDataByLocalityId(locality.id);
      const heatmapData = await this.getHeatmapDataByLocalityId(locality.id);
      result.push({
        ...locality,
        propertyData,
        heatmapData
      });
    }
    return result;
  }
  // Developer operations
  async getDevelopers() {
    return Array.from(this.developers.values());
  }
  async getDeveloperById(id) {
    return this.developers.get(id);
  }
  async createDeveloper(insertDeveloper) {
    const id = randomUUID();
    const developer = { ...insertDeveloper, id };
    this.developers.set(id, developer);
    return developer;
  }
  // Property operations
  async getProperties() {
    return Array.from(this.properties.values());
  }
  async getPropertiesWithDeveloper() {
    const properties = await this.getProperties();
    const result = [];
    for (const property of properties) {
      const developer = await this.getDeveloperById(property.developerId);
      const locality = await this.getLocalityById(property.localityId);
      if (developer && locality) {
        result.push({
          ...property,
          developer,
          locality
        });
      }
    }
    return result;
  }
  async getPropertiesByDeveloper(developerId) {
    return Array.from(this.properties.values()).filter((prop) => prop.developerId === developerId);
  }
  async getPropertiesByLocality(localityId) {
    return Array.from(this.properties.values()).filter((prop) => prop.localityId === localityId);
  }
  async createProperty(insertProperty) {
    const id = randomUUID();
    const property = {
      ...insertProperty,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.properties.set(id, property);
    return property;
  }
  // Workplace operations
  async getWorkplaces() {
    return Array.from(this.workplaces.values());
  }
  async getWorkplaceById(id) {
    return this.workplaces.get(id);
  }
  async searchWorkplaces(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.workplaces.values()).filter(
      (workplace) => workplace.name.toLowerCase().includes(lowerQuery) || workplace.address.toLowerCase().includes(lowerQuery) || workplace.description?.toLowerCase().includes(lowerQuery)
    );
  }
  async createWorkplace(insertWorkplace) {
    const id = randomUUID();
    const workplace = { ...insertWorkplace, id };
    this.workplaces.set(id, workplace);
    return workplace;
  }
  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  // Get recommended localities based on workplace proximity, transport score, and utility coverage
  async getRecommendedLocalities(workplaceId, maxPricePerSqft) {
    const workplace = await this.getWorkplaceById(workplaceId);
    if (!workplace) {
      return [];
    }
    const localities = await this.getLocalitiesWithData();
    const workplaceLat = parseFloat(workplace.latitude);
    const workplaceLon = parseFloat(workplace.longitude);
    const scoredLocalities = localities.filter((locality) => {
      if (maxPricePerSqft && locality.propertyData?.residentialPricePerSqft) {
        return locality.propertyData.residentialPricePerSqft <= maxPricePerSqft;
      }
      return true;
    }).map((locality) => {
      const distance = this.calculateDistance(
        workplaceLat,
        workplaceLon,
        parseFloat(locality.latitude),
        parseFloat(locality.longitude)
      );
      const transportScore = locality.propertyData?.transportScore ? parseFloat(locality.propertyData.transportScore) : 0;
      const utilityCoverage = locality.propertyData?.utilityCoverage || 0;
      const normalizedTransport = transportScore / 10 * 100;
      const normalizedUtility = utilityCoverage;
      const proximityScore = Math.max(0, 100 - distance * 5);
      const totalScore = normalizedTransport * 0.4 + normalizedUtility * 0.35 + proximityScore * 0.25;
      return {
        ...locality,
        distance,
        recommendationScore: totalScore,
        transportScore: normalizedTransport,
        utilityScore: normalizedUtility,
        proximityScore
      };
    }).filter((locality) => locality.distance <= 25).sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 10);
    return scoredLocalities;
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/localities", async (req, res) => {
    try {
      const localities = await storage.getLocalitiesWithData();
      res.json(localities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch localities" });
    }
  });
  app2.get("/api/localities/:id", async (req, res) => {
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
  app2.get("/api/heatmap/:dataType", async (req, res) => {
    try {
      const { dataType } = req.params;
      const validTypes = ["residential_prices", "commercial_prices", "transport", "utilities", "roads"];
      if (!validTypes.includes(dataType)) {
        return res.status(400).json({ message: "Invalid data type" });
      }
      const heatmapData = await storage.getHeatmapData(dataType);
      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heatmap data" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query required" });
      }
      const localities = await storage.getLocalitiesWithData();
      const filteredLocalities = localities.filter(
        (locality) => locality.name.toLowerCase().includes(q.toLowerCase())
      );
      res.json(filteredLocalities);
    } catch (error) {
      res.status(500).json({ message: "Failed to search localities" });
    }
  });
  app2.get("/api/statistics", async (req, res) => {
    try {
      const localities = await storage.getLocalitiesWithData();
      let totalResidential = 0;
      let totalCommercial = 0;
      let totalTransport = 0;
      let totalUtility = 0;
      let totalListings = 0;
      let count = 0;
      localities.forEach((locality) => {
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
        avgTransportScore: count > 0 ? Math.round(totalTransport / count * 10) / 10 : 0,
        avgUtilityCoverage: count > 0 ? Math.round(totalUtility / count) : 0,
        totalListings,
        totalLocalities: count
      };
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/developers", async (req, res) => {
    try {
      const developers = await storage.getDevelopers();
      res.json(developers);
    } catch (error) {
      console.error("Error fetching developers:", error);
      res.status(500).json({ error: "Failed to fetch developers" });
    }
  });
  app2.get("/api/developers/:id", async (req, res) => {
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
  app2.get("/api/properties", async (req, res) => {
    try {
      const { developer, locality } = req.query;
      let properties;
      if (developer) {
        properties = await storage.getPropertiesByDeveloper(developer);
      } else if (locality) {
        properties = await storage.getPropertiesByLocality(locality);
      } else {
        properties = await storage.getPropertiesWithDeveloper();
      }
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });
  app2.get("/api/workplaces", async (req, res) => {
    try {
      const workplaces = await storage.getWorkplaces();
      res.json(workplaces);
    } catch (error) {
      console.error("Error fetching workplaces:", error);
      res.status(500).json({ error: "Failed to fetch workplaces" });
    }
  });
  app2.get("/api/workplaces/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query required" });
      }
      const workplaces = await storage.searchWorkplaces(q);
      res.json(workplaces);
    } catch (error) {
      console.error("Error searching workplaces:", error);
      res.status(500).json({ error: "Failed to search workplaces" });
    }
  });
  app2.get("/api/recommendations/:workplaceId", async (req, res) => {
    try {
      const { workplaceId } = req.params;
      const { maxPrice } = req.query;
      const maxPricePerSqft = maxPrice ? parseInt(maxPrice) : void 0;
      const recommendations = await storage.getRecommendedLocalities(workplaceId, maxPricePerSqft);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
