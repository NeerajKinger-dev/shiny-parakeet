export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface LayerConfig {
  id: string;
  name: string;
  color: string;
  unit?: string;
}

export const layerConfigs: LayerConfig[] = [
  {
    id: 'residential_prices',
    name: 'Residential Land Prices',
    color: '#ef4444',
    unit: '₹/sq ft'
  },
  {
    id: 'commercial_prices',
    name: 'Commercial Land Prices',
    color: '#f97316',
    unit: '₹/sq ft'
  },
  {
    id: 'transport',
    name: 'Transport Coverage',
    color: '#3b82f6',
    unit: 'Score'
  },
  {
    id: 'utilities',
    name: 'Water & Sewerage',
    color: '#8b5cf6',
    unit: '%'
  },
  {
    id: 'roads',
    name: 'Road Access Quality',
    color: '#22c55e',
    unit: 'Score'
  }
];

export const northBangaloreBounds = {
  north: 13.3,
  south: 12.9,
  east: 77.8,
  west: 77.4
};

export function generateHeatmapPoints(centerLat: number, centerLng: number, count: number = 10): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    const intensity = Math.random();
    
    points.push({
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
      intensity
    });
  }
  
  return points;
}

export function getColorForValue(value: number, layer: string): string {
  const colorMaps = {
    residential_prices: {
      ranges: [2000, 4000, 6000, 8000],
      colors: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444']
    },
    commercial_prices: {
      ranges: [5000, 10000, 15000, 20000],
      colors: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444']
    },
    transport: {
      ranges: [3, 5, 7, 9],
      colors: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
    },
    utilities: {
      ranges: [60, 75, 85, 95],
      colors: ['#e9d5ff', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed']
    },
    roads: {
      ranges: [3, 5, 7, 9],
      colors: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
    }
  };

  const config = colorMaps[layer as keyof typeof colorMaps];
  if (!config) return '#6b7280';

  for (let i = 0; i < config.ranges.length; i++) {
    if (value <= config.ranges[i]) {
      return config.colors[i];
    }
  }
  
  return config.colors[config.colors.length - 1];
}
