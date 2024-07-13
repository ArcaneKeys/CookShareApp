import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe, Ingredient, Category } from '../models/recipe.model';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {
  recipe: Recipe = {
    id: 0,
    name: '',
    instructions: '',
    pictureUrl: '',
    preparationTime: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: [],
    categories: [],
    isFavorite: false
  };
  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  selectedIngredients: { ingredientId: number, quantity: number }[] = [];
  selectedCategories: Category[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  alertMessage: string | null = null;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.recipeService.getIngredients().subscribe({
      next: ingredients => this.ingredients = ingredients,
      error: err => console.error(err)
    });

    this.recipeService.getCategories().subscribe({
      next: categories => this.categories = categories,
      error: err => console.error(err)
    });
  }

  onIngredientChange(event: any, ingredientId: number) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedIngredients.push({ ingredientId, quantity: 0 });
    } else {
      this.selectedIngredients = this.selectedIngredients.filter(item => item.ingredientId !== ingredientId);
    }
  }

  onCategoryChange(event: any, categoryId: number) {
    const isChecked = event.target.checked;
    const category = this.categories.find(c => c.id === categoryId);
    if (isChecked && category) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c.id !== categoryId);
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.recipe.pictureUrl = this.imagePreview as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getIngredientQuantity(ingredientId: number): number {
    const ingredient = this.selectedIngredients.find(item => item.ingredientId === ingredientId);
    return ingredient ? ingredient.quantity : 0;
  }

  setIngredientQuantity(ingredientId: number, event: any) {
    const ingredient = this.selectedIngredients.find(item => item.ingredientId === ingredientId);
    if (ingredient) {
      ingredient.quantity = +event.target.value; // parse quantity to number
    }
  }

  isIngredientSelected(ingredientId: number): boolean {
    return this.selectedIngredients.some(item => item.ingredientId === ingredientId);
  }

  onSubmit() {
    this.recipe.ingredients = this.selectedIngredients.map(item => ({
      ...this.ingredients.find(ingredient => ingredient.id === item.ingredientId),
      quantity: item.quantity
    })) as Ingredient[];

    this.recipe.categories = this.selectedCategories.map(category => category);

    this.recipeService.addRecipe(this.recipe).subscribe({
      next: (recipe) => {
        this.alertMessage = 'Recipe added successfully!';
        this.resetForm();
        setTimeout(() => {
          this.alertMessage = null;
          this.router.navigate(['/recipes']);
        }, 2000);
      },
      error: (err) => console.error(err)
    });
  }

  private resetForm() {
    this.recipe = {
      id: 0,
      name: '',
      instructions: '',
      pictureUrl: '',
      preparationTime: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      ingredients: [],
      categories: [],
      isFavorite: false
    };
    this.selectedIngredients = [];
    this.selectedCategories = [];
    this.imagePreview = null;
  }
}
