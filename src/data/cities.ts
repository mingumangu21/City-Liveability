import data from "./cities.json";
export interface City {
  id: string;
  name: string;
  english: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
  climate: string;
  cost: number;
  housing: string;
  scores: number[];
  transport: string;
  advantages: string[];
  disadvantages: string[];
  images: string[];
  imageSource: string;
  dataNote: string;
  statistics: {
    indicator: string;
    value: number;
    unit: string;
    year: number;
    sourceUrl: string;
  }[];
  costMetadata: {
    kind: string;
    unit: string;
    scenarioYear: number;
    includesHousing: boolean;
    source: string;
  };
  ratingMetadata: {
    score: number;
    kind: string;
    scenarioYear: number;
    basis: string;
    source: string;
  }[];
}
export const cities: City[] = data;
