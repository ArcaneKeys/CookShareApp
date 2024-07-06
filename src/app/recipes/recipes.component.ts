import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getRecipes().subscribe({
      next: recipes => this.recipes = recipes
    });
  }
}
