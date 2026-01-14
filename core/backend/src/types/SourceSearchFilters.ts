export interface SourceSearchFilters {
  name?: string;
  type?: string;
  publisher?: string;
  minImpactFactor?: number;
  maxImpactFactor?: number;
  limit?: number;
  offset?: number;
}