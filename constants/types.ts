// OpenFoodFacts

export interface ProductResponse {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
}

export interface SearchResponse {
  hits: SearchProduct[];
}

export interface Product {
  _id: string;
  product_name: string;
  quantity: string;
  packaging: string;
  categories: string;
  nutriscore_grade: "a" | "b" | "c" | "d" | "e";
  nova_group: 1 | 2 | 3 | 4;
  ecoscore_grade: "a" | "b" | "c" | "d" | "e";
  nutrient_levels: {
    fat?: "low" | "moderate" | "high";
    salt?: "low" | "moderate" | "high";
    "saturated-fat"?: "low" | "moderate" | "high";
    sugars?: "low" | "moderate" | "high";
  };
  nutriments: {
    "energy-kcal"?: number;
    proteins_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
  };
  ingredients_analysis: { [key: string]: string[] };
}

export interface SearchProduct {
  code: string;
  product_name: string;
  quantity: string;
  nutriscore_grade: "a" | "b" | "c" | "d" | "e" | "unknown";
  nutriments?: {
    "energy-kcal"?: number;
  };
}
