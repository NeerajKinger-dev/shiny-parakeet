# Overview

This is a real estate SaaS application called "Insight Realty" that provides interactive heatmap visualizations and property showcase for North Bangalore. The application displays analytics including residential and commercial land prices, transport coverage, utility infrastructure, and road quality across different localities. It features an interactive map interface with hybrid layer switching controls and a comprehensive property showcase displaying projects from major developers including Sobha, Brigade, Century, Provident, and Prestige.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: React Leaflet for interactive map functionality with heatmap overlays
- **Build Tool**: Vite for fast development and optimized production builds

The application uses a dashboard layout with a header, sidebar for layer controls, and main map view. Components are organized into logical folders (layout, map, ui) with clear separation of concerns.

## Backend Architecture

The backend follows a simple Express.js REST API pattern:

- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for localities, property data, and heatmap data
- **Data Layer**: In-memory storage implementation with interface for future database integration
- **Development**: Vite middleware integration for hot reloading in development

The storage layer uses an interface-based design allowing for easy swapping between in-memory storage (current) and database implementations.

## Data Storage

Currently uses in-memory storage with sample data for North Bangalore localities:

- **Localities**: Geographic coordinates and basic information for 8+ areas
- **Property Data**: Pricing, transport scores, utility coverage, and road quality metrics
- **Heatmap Data**: Intensity values and coordinate arrays for map visualization

The schema is designed with Drizzle ORM for future PostgreSQL integration, with proper relationships between localities, property data, and heatmap data tables.

## Component Design

- **Modular UI Components**: Reusable shadcn/ui components with consistent styling
- **Map Integration**: Custom heatmap layer component that integrates with Leaflet
- **Responsive Design**: Mobile-friendly layout with adaptive sidebar and controls
- **Interactive Elements**: Clickable map areas with popup details and layer switching

# External Dependencies

## Database
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database service (configured but not actively used)
- **Migration System**: Drizzle Kit for database schema management

## UI and Styling
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography

## Maps and Visualization
- **Leaflet**: Open-source mapping library for interactive maps
- **React Leaflet**: React bindings for Leaflet integration
- **Heatmap Visualization**: Custom implementation for property data overlay

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Static typing for enhanced developer experience
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Cartographer plugin and error overlay for Replit environment

## State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for type-safe data handling

## Additional Libraries
- **Wouter**: Lightweight routing solution
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX**: Conditional className utility for dynamic styling