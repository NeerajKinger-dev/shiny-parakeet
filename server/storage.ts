import { type Locality, type PropertyData, type HeatmapData, type InsertLocality, type InsertPropertyData, type InsertHeatmapData, type LocalityWithData, type Developer, type Property, type InsertDeveloper, type InsertProperty, type PropertyWithDeveloper, type Workplace, type InsertWorkplace } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Locality operations
  getLocalities(): Promise<Locality[]>;
  getLocalityById(id: string): Promise<Locality | undefined>;
  createLocality(locality: InsertLocality): Promise<Locality>;
  
  // Property data operations
  getPropertyData(): Promise<PropertyData[]>;
  getPropertyDataByLocalityId(localityId: string): Promise<PropertyData | undefined>;
  createPropertyData(data: InsertPropertyData): Promise<PropertyData>;
  
  // Heatmap data operations
  getHeatmapData(dataType?: string): Promise<HeatmapData[]>;
  getHeatmapDataByLocalityId(localityId: string): Promise<HeatmapData[]>;
  createHeatmapData(data: InsertHeatmapData): Promise<HeatmapData>;
  
  // Combined operations
  getLocalitiesWithData(): Promise<LocalityWithData[]>;
  
  // Developer operations
  getDevelopers(): Promise<Developer[]>;
  getDeveloperById(id: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getPropertiesWithDeveloper(): Promise<PropertyWithDeveloper[]>;
  getPropertiesByDeveloper(developerId: string): Promise<Property[]>;
  getPropertiesByLocality(localityId: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Workplace operations
  getWorkplaces(): Promise<Workplace[]>;
  getWorkplaceById(id: string): Promise<Workplace | undefined>;
  searchWorkplaces(query: string): Promise<Workplace[]>;
  createWorkplace(workplace: InsertWorkplace): Promise<Workplace>;
  
  // Commute-based recommendations
  getRecommendedLocalities(workplaceId: string, maxPricePerSqft?: number): Promise<LocalityWithData[]>;
}

export class MemStorage implements IStorage {
  private localities: Map<string, Locality>;
  private propertyData: Map<string, PropertyData>;
  private heatmapData: Map<string, HeatmapData>;
  private developers: Map<string, Developer>;
  private properties: Map<string, Property>;
  private workplaces: Map<string, Workplace>;

  constructor() {
    this.localities = new Map();
    this.propertyData = new Map();
    this.heatmapData = new Map();
    this.developers = new Map();
    this.properties = new Map();
    this.workplaces = new Map();
    
    // Initialize with North Bangalore data
    this.initializeData();
  }

  private async initializeData() {
    // Create sample localities in North Bangalore
    const localityData = [
      { name: "Yelahanka", latitude: "13.1007", longitude: "77.5963" },
      { name: "Devanahalli", latitude: "13.2519", longitude: "77.7018" },
      { name: "Hebbal", latitude: "13.0358", longitude: "77.5970" },
      { name: "Jakkur", latitude: "13.0837", longitude: "77.6648" },
      { name: "Sahakara Nagar", latitude: "13.0173", longitude: "77.5848" },
      { name: "RT Nagar", latitude: "13.0127", longitude: "77.5934" },
      { name: "Hennur", latitude: "13.0417", longitude: "77.6417" },
      { name: "Banaswadi", latitude: "13.0117", longitude: "77.6648" },
    ];

    for (const locality of localityData) {
      const localityId = randomUUID();
      const loc: Locality = {
        id: localityId,
        region: "North Bangalore",
        name: locality.name,
        latitude: locality.latitude,
        longitude: locality.longitude
      };
      this.localities.set(localityId, loc);

      // Add property data
      const propData: PropertyData = {
        id: randomUUID(),
        localityId,
        residentialPricePerSqft: Math.floor(Math.random() * 8000) + 2000,
        commercialPricePerSqft: Math.floor(Math.random() * 12000) + 8000,
        transportScore: (Math.floor(Math.random() * 40) + 60).toString(),
        utilityCoverage: Math.floor(Math.random() * 30) + 70,
        roadQualityScore: (Math.floor(Math.random() * 30) + 70).toString(),
        totalListings: Math.floor(Math.random() * 500) + 100,
        lastUpdated: new Date().toISOString(),
      };
      this.propertyData.set(propData.id, propData);

      // Add heatmap data for different layers
      const dataTypes = ['residential_prices', 'commercial_prices', 'transport', 'utilities', 'roads'];
      for (const dataType of dataTypes) {
        const intensity = Math.floor(Math.random() * 100);
        const coordinates = this.generateHeatmapCoordinates(parseFloat(locality.latitude), parseFloat(locality.longitude));
        
        const heatData: HeatmapData = {
          id: randomUUID(),
          localityId,
          dataType,
          intensity: intensity.toString(),
          coordinates
        };
        this.heatmapData.set(heatData.id, heatData);
      }
    }

    // Initialize developers
    this.initializeDevelopers();
    
    // Initialize properties
    this.initializeProperties();
    
    // Initialize workplaces
    this.initializeWorkplaces();
  }

  private async initializeDevelopers() {
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
      const developer: Developer = {
        id: developerId,
        logo: null,
        ...devData
      };
      this.developers.set(developerId, developer);
    }
  }

  private async initializeProperties() {
    const localities = Array.from(this.localities.values());
    const developers = Array.from(this.developers.values());
    
    const propertyTypes = ['apartment', 'villa', 'commercial', 'plot'];
    const statuses = ['upcoming', 'under_construction', 'ready_to_move'];
    const bedroomsOptions = ['1 BHK', '2 BHK', '3 BHK', '2-3 BHK', '3-4 BHK', '4-5 BHK'];
    
    const commonAmenities = [
      'Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 
      'Security', 'Power Backup', 'Parking', 'Garden', 'Jogging Track'
    ];

    // Create sample properties for each developer in different localities
    for (const developer of developers) {
      for (let i = 0; i < 3; i++) { // 3 properties per developer
        const locality = localities[Math.floor(Math.random() * localities.length)];
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const propertyId = randomUUID();
        const property: Property = {
          id: propertyId,
          name: `${developer.name.split(' ')[0]} ${locality.name} ${propertyType === 'apartment' ? 'Heights' : propertyType === 'villa' ? 'Villas' : propertyType === 'commercial' ? 'Plaza' : 'Plots'}`,
          developerId: developer.id,
          localityId: locality.id,
          propertyType,
          priceRange: propertyType === 'apartment' ? '₹45L - ₹1.2Cr' : 
                     propertyType === 'villa' ? '₹1.5Cr - ₹3.5Cr' :
                     propertyType === 'commercial' ? '₹80L - ₹2Cr' : '₹25L - ₹60L',
          size: propertyType === 'apartment' ? '800-1800 sq ft' :
                propertyType === 'villa' ? '1800-3500 sq ft' :
                propertyType === 'commercial' ? '500-2000 sq ft' : '1200-2400 sq ft',
          bedrooms: propertyType === 'commercial' || propertyType === 'plot' ? null : 
                   bedroomsOptions[Math.floor(Math.random() * bedroomsOptions.length)],
          status,
          launchDate: status === 'upcoming' ? '2024-Q4' : '2024-Q2',
          possessionDate: status === 'ready_to_move' ? 'Immediate' : '2025-Q3',
          amenities: commonAmenities.slice(0, Math.floor(Math.random() * 6) + 3),
          images: [],
          latitude: (parseFloat(locality.latitude) + (Math.random() - 0.5) * 0.01).toString(),
          longitude: (parseFloat(locality.longitude) + (Math.random() - 0.5) * 0.01).toString(),
          createdAt: new Date().toISOString()
        };
        
        this.properties.set(propertyId, property);
      }
    }
  }

  private async initializeWorkplaces() {
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
      const workplace: Workplace = {
        id: workplaceId,
        ...workplaceData
      };
      this.workplaces.set(workplaceId, workplace);
    }
  }

  private generateHeatmapCoordinates(centerLat: number, centerLng: number) {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      const intensity = Math.random();
      points.push([centerLat + latOffset, centerLng + lngOffset, intensity]);
    }
    return points;
  }

  async getLocalities(): Promise<Locality[]> {
    return Array.from(this.localities.values());
  }

  async getLocalityById(id: string): Promise<Locality | undefined> {
    return this.localities.get(id);
  }

  async createLocality(insertLocality: InsertLocality): Promise<Locality> {
    const id = randomUUID();
    const locality: Locality = { ...insertLocality, id };
    this.localities.set(id, locality);
    return locality;
  }

  async getPropertyData(): Promise<PropertyData[]> {
    return Array.from(this.propertyData.values());
  }

  async getPropertyDataByLocalityId(localityId: string): Promise<PropertyData | undefined> {
    return Array.from(this.propertyData.values()).find(data => data.localityId === localityId);
  }

  async createPropertyData(insertData: InsertPropertyData): Promise<PropertyData> {
    const id = randomUUID();
    const data: PropertyData = { 
      ...insertData, 
      id,
      lastUpdated: new Date().toISOString()
    };
    this.propertyData.set(id, data);
    return data;
  }

  async getHeatmapData(dataType?: string): Promise<HeatmapData[]> {
    const allData = Array.from(this.heatmapData.values());
    return dataType ? allData.filter(data => data.dataType === dataType) : allData;
  }

  async getHeatmapDataByLocalityId(localityId: string): Promise<HeatmapData[]> {
    return Array.from(this.heatmapData.values()).filter(data => data.localityId === localityId);
  }

  async createHeatmapData(insertData: InsertHeatmapData): Promise<HeatmapData> {
    const id = randomUUID();
    const data: HeatmapData = { ...insertData, id };
    this.heatmapData.set(id, data);
    return data;
  }

  async getLocalitiesWithData(): Promise<LocalityWithData[]> {
    const localities = await this.getLocalities();
    const result: LocalityWithData[] = [];

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
  async getDevelopers(): Promise<Developer[]> {
    return Array.from(this.developers.values());
  }

  async getDeveloperById(id: string): Promise<Developer | undefined> {
    return this.developers.get(id);
  }

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = randomUUID();
    const developer: Developer = { ...insertDeveloper, id };
    this.developers.set(id, developer);
    return developer;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesWithDeveloper(): Promise<PropertyWithDeveloper[]> {
    const properties = await this.getProperties();
    const result: PropertyWithDeveloper[] = [];

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

  async getPropertiesByDeveloper(developerId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(prop => prop.developerId === developerId);
  }

  async getPropertiesByLocality(localityId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(prop => prop.localityId === localityId);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { 
      ...insertProperty, 
      id,
      createdAt: new Date().toISOString()
    };
    this.properties.set(id, property);
    return property;
  }

  // Workplace operations
  async getWorkplaces(): Promise<Workplace[]> {
    return Array.from(this.workplaces.values());
  }

  async getWorkplaceById(id: string): Promise<Workplace | undefined> {
    return this.workplaces.get(id);
  }

  async searchWorkplaces(query: string): Promise<Workplace[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.workplaces.values()).filter(workplace =>
      workplace.name.toLowerCase().includes(lowerQuery) ||
      workplace.address.toLowerCase().includes(lowerQuery) ||
      workplace.description?.toLowerCase().includes(lowerQuery)
    );
  }

  async createWorkplace(insertWorkplace: InsertWorkplace): Promise<Workplace> {
    const id = randomUUID();
    const workplace: Workplace = { ...insertWorkplace, id };
    this.workplaces.set(id, workplace);
    return workplace;
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get recommended localities based on workplace proximity, transport score, and utility coverage
  async getRecommendedLocalities(workplaceId: string, maxPricePerSqft?: number): Promise<LocalityWithData[]> {
    const workplace = await this.getWorkplaceById(workplaceId);
    if (!workplace) {
      return [];
    }

    const localities = await this.getLocalitiesWithData();
    const workplaceLat = parseFloat(workplace.latitude);
    const workplaceLon = parseFloat(workplace.longitude);

    // Filter and score localities
    const scoredLocalities = localities
      .filter(locality => {
        // Filter by price if specified
        if (maxPricePerSqft && locality.propertyData?.residentialPricePerSqft) {
          return locality.propertyData.residentialPricePerSqft <= maxPricePerSqft;
        }
        return true;
      })
      .map(locality => {
        const distance = this.calculateDistance(
          workplaceLat, workplaceLon,
          parseFloat(locality.latitude), parseFloat(locality.longitude)
        );

        // Scoring algorithm: prioritize transport score, utility coverage, and proximity
        const transportScore = locality.propertyData?.transportScore ? parseFloat(locality.propertyData.transportScore) : 0;
        const utilityCoverage = locality.propertyData?.utilityCoverage || 0;
        
        // Normalize scores (0-100 scale)
        const normalizedTransport = (transportScore / 10) * 100; // Transport score is 0-10
        const normalizedUtility = utilityCoverage; // Already 0-100
        const proximityScore = Math.max(0, 100 - (distance * 5)); // Closer = higher score

        // Weighted scoring: Transport (40%), Utility (35%), Proximity (25%)
        const totalScore = (normalizedTransport * 0.4) + (normalizedUtility * 0.35) + (proximityScore * 0.25);

        return {
          ...locality,
          distance,
          recommendationScore: totalScore,
          transportScore: normalizedTransport,
          utilityScore: normalizedUtility,
          proximityScore
        };
      })
      .filter(locality => locality.distance <= 25) // Within 25km radius
      .sort((a, b) => b.recommendationScore - a.recommendationScore) // Highest score first
      .slice(0, 10); // Top 10 recommendations

    return scoredLocalities;
  }
}

export const storage = new MemStorage();
