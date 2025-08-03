import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://YOUR_PROJECT.supabase.co", // 🔹 Replace with your Supabase Project URL
  "YOUR_SERVICE_ROLE_KEY" // 🔹 Use SERVICE ROLE KEY (keep private)
);

const citiesData = {
  Bangalore: [
    { name: "Whitefield", lat: 12.9698, lng: 77.75, price: 6500, transport: 8, utility: 9, road: 7, intensity: 0.7 },
    { name: "Koramangala", lat: 12.9352, lng: 77.6245, price: 7200, transport: 9, utility: 8, road: 8, intensity: 0.8 },
    { name: "Indiranagar", lat: 12.9784, lng: 77.6408, price: 8000, transport: 9, utility: 9, road: 9, intensity: 0.9 },
  ],
  Mumbai: [
    { name: "Bandra", lat: 19.0544, lng: 72.8402, price: 45000, transport: 9, utility: 9, road: 8, intensity: 0.9 },
    { name: "Andheri", lat: 19.1197, lng: 72.8468, price: 30000, transport: 8, utility: 8, road: 7, intensity: 0.8 },
    { name: "Colaba", lat: 18.9067, lng: 72.8147, price: 40000, transport: 9, utility: 9, road: 8, intensity: 0.85 },
  ],
  Hyderabad: [
    { name: "Banjara Hills", lat: 17.4146, lng: 78.4483, price: 12000, transport: 8, utility: 9, road: 8, intensity: 0.8 },
    { name: "Gachibowli", lat: 17.4435, lng: 78.3524, price: 9000, transport: 7, utility: 8, road: 7, intensity: 0.7 },
    { name: "Madhapur", lat: 17.4486, lng: 78.3908, price: 10000, transport: 8, utility: 8, road: 8, intensity: 0.75 },
  ],
  Delhi: [
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167, price: 25000, transport: 9, utility: 9, road: 8, intensity: 0.9 },
    { name: "Saket", lat: 28.5245, lng: 77.2066, price: 18000, transport: 8, utility: 8, road: 7, intensity: 0.8 },
    { name: "Karol Bagh", lat: 28.6513, lng: 77.1887, price: 20000, transport: 8, utility: 8, road: 7, intensity: 0.85 },
  ],
};

async function seedDatabase() {
  for (const [cityName, localities] of Object.entries(citiesData)) {
    // Insert city
    const { data: cityData } = await supabase
      .from("cities")
      .insert({ name: cityName })
      .select()
      .single();

    if (!cityData) continue;

    for (const loc of localities) {
      // Insert locality
      const { data: localityData } = await supabase
        .from("localities")
        .insert({
          city_id: cityData.id,
          name: loc.name,
          latitude: loc.lat,
          longitude: loc.lng,
        })
        .select()
        .single();

      if (!localityData) continue;

      // Insert property data
      await supabase.from("property_data").insert({
        locality_id: localityData.id,
        price_per_sqft: loc.price,
        transport_score: loc.transport,
        utility_score: loc.utility,
        road_quality: loc.road,
      });

      // Insert heatmap data
      await supabase.from("heatmap_data").insert({
        locality_id: localityData.id,
        intensity: loc.intensity,
        latitude: loc.lat,
        longitude: loc.lng,
      });
    }
  }

  console.log("✅ Database seeding completed!");
}

seedDatabase();
