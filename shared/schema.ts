import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const localities = pgTable("localities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  region: text("region").notNull().default("North Bangalore"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
});

export const propertyData = pgTable("property_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  localityId: varchar("locality_id").references(() => localities.id).notNull(),
  residentialPricePerSqft: integer("residential_price_per_sqft"),
  commercialPricePerSqft: integer("commercial_price_per_sqft"),
  transportScore: decimal("transport_score", { precision: 3, scale: 1 }),
  utilityCoverage: integer("utility_coverage"), // percentage
  roadQualityScore: decimal("road_quality_score", { precision: 3, scale: 1 }),
  totalListings: integer("total_listings").default(0),
  lastUpdated: text("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

export const developers = pgTable("developers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"),
  description: text("description"),
  establishedYear: integer("established_year"),
  totalProjects: integer("total_projects").default(0),
  website: text("website"),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  developerId: varchar("developer_id").references(() => developers.id).notNull(),
  localityId: varchar("locality_id").references(() => localities.id).notNull(),
  propertyType: text("property_type").notNull(), // 'apartment', 'villa', 'commercial', 'plot'
  priceRange: text("price_range").notNull(),
  size: text("size"), // e.g., "1200-2800 sq ft"
  bedrooms: text("bedrooms"), // e.g., "2-4 BHK"
  status: text("status").notNull().default("upcoming"), // 'upcoming', 'under_construction', 'ready_to_move'
  launchDate: text("launch_date"),
  possessionDate: text("possession_date"),
  amenities: text("amenities").array(),
  images: text("images").array(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const workplaces = pgTable("workplaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  category: text("category").notNull(), // 'tech_park', 'business_district', 'office_complex'
  description: text("description"),
});

export const heatmapData = pgTable("heatmap_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  localityId: varchar("locality_id").references(() => localities.id).notNull(),
  dataType: text("data_type").notNull(), // 'residential_prices', 'commercial_prices', 'transport', 'utilities', 'roads'
  intensity: decimal("intensity", { precision: 5, scale: 2 }).notNull(), // 0-100 for heatmap intensity
  coordinates: jsonb("coordinates").notNull(), // Array of [lat, lng, intensity] points
});

export const insertLocalitySchema = createInsertSchema(localities).omit({
  id: true,
});

export const insertPropertyDataSchema = createInsertSchema(propertyData).omit({
  id: true,
  lastUpdated: true,
});

export const insertHeatmapDataSchema = createInsertSchema(heatmapData).omit({
  id: true,
});

export const insertDeveloperSchema = createInsertSchema(developers).omit({
  id: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertWorkplaceSchema = createInsertSchema(workplaces).omit({
  id: true,
});

export type InsertLocality = z.infer<typeof insertLocalitySchema>;
export type Locality = typeof localities.$inferSelect;

export type InsertPropertyData = z.infer<typeof insertPropertyDataSchema>;
export type PropertyData = typeof propertyData.$inferSelect;

export type InsertHeatmapData = z.infer<typeof insertHeatmapDataSchema>;
export type HeatmapData = typeof heatmapData.$inferSelect;

export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertWorkplace = z.infer<typeof insertWorkplaceSchema>;
export type Workplace = typeof workplaces.$inferSelect;

// Combined type for locality with property data
export type LocalityWithData = Locality & {
  propertyData?: PropertyData;
  heatmapData?: HeatmapData[];
  distance?: number; // Distance from workplace in km
  recommendationScore?: number; // Overall recommendation score
  transportScore?: number; // Normalized transport score
  utilityScore?: number; // Normalized utility score
  proximityScore?: number; // Proximity score
};

// Property with developer info
export type PropertyWithDeveloper = Property & {
  developer: Developer;
  locality: Locality;
};
