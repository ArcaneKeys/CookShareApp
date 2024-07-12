import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, Ingredient, Category } from './models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<{recipes: Recipe[]}>(`${this.apiUrl}/recipes`).pipe(
      map(response => response.recipes)
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe);
  }

  updateRecipe(id: number, recipe: Recipe): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/recipes/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipes/${id}`);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<{ingredients: Ingredient[]}>(`${this.apiUrl}/ingredients`).pipe(
      map(response => response.ingredients)
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<{categories: Category[]}>(`${this.apiUrl}/categories`).pipe(
      map(response => response.categories)
    );
  }
}
