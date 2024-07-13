export interface Recipe {
    id: number;
    name: string;
    instructions: string;
    pictureUrl: string;
    preparationTime: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: Ingredient[];
    categories: Category[];
    isFavorite: boolean;
  }
  
  export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    iconUrl: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  