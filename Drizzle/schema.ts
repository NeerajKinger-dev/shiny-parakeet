import { pgTable, serial, text, integer, numeric } from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const localities = pgTable("localities", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").references(() => cities.id),
  name: text("name").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
});

export const propertyData = pgTable("property_data", {
  id: serial("id").primaryKey(),
  localityId: integer("locality_id").references(() => localities.id),
  pricePerSqft: numeric("price_per_sqft").notNull(),
  transportScore: integer("transport_score"),
  utilityScore: integer("utility_score"),
  roadQuality: integer("road_quality"),
});

export const heatmapData = pgTable("heatmap_data", {
  id: serial("id").primaryKey(),
  localityId: integer("locality_id").references(() => localities.id),
  intensity: numeric("intensity").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
});
