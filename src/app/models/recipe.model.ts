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
    categories: string[];
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    iconUrl: string;
}
