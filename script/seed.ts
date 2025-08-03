import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://your-project.supabase.co", // 🔹 Replace with your Supabase Project URL
  "your-service-role-key" // 🔹 Use SERVICE ROLE KEY here
);

async function seedData() {
  // Insert cities
  const { data: cities } = await supabase.from("cities").insert([
    { name: "Bangalore" },
    { name: "Mumbai" },
    { name: "Hyderabad" },
    { name: "Delhi" },
  ]).select();

  console.log("Cities added:", cities);

  // Example locality for Bangalore
  const { data: localities } = await supabase.from("localities").insert([
    { city_id: cities?.find(c => c.name === "Bangalore")?.id, name: "Whitefield", latitude: 12.9698, longitude: 77.75 },
    { city_id: cities?.find(c => c.name === "Bangalore")?.id, name: "Koramangala", latitude: 12.9352, longitude: 77.6245 },
    { city_id: cities?.find(c => c.name === "Bangalore")?.id, name: "Indiranagar", latitude: 12.9784, longitude: 77.6408 },
  ]).select();

  console.log("Localities added:", localities);

  // Add property data
  await supabase.from("property_data").insert([
    { locality_id: localities?.[0]?.id, price_per_sqft: 6500, transport_score: 8, utility_score: 9, road_quality: 7 },
    { locality_id: localities?.[1]?.id, price_per_sqft: 7200, transport_score: 9, utility_score: 8, road_quality: 8 },
    { locality_id: localities?.[2]?.id, price_per_sqft: 8000, transport_score: 9, utility_score: 9, road_quality: 9 },
  ]);

  console.log("Property data added!");
}

seedData();
