import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css'
})
export class RecipeInfoComponent {
  @Input() recipe!: Recipe;
  @Output() favoriteChanged = new EventEmitter<void>();

  constructor(private recipeService: RecipeService, private router: Router) {}

  toggleFavorite() {
    if (this.recipe.isFavorite) {
      this.recipeService.removeFavorite(this.recipe.id).subscribe({
        next: () => {
          this.recipe.isFavorite = false;
          this.favoriteChanged.emit();
        },
        error: err => console.error(err)
      });
    } else {
      this.recipeService.addFavorite(this.recipe.id).subscribe({
        next: () => {
          this.recipe.isFavorite = true;
          this.favoriteChanged.emit();
        },
        error: err => console.error(err)
      });
    }
  }

  generateShoppingList(recipeId: number) {
    this.router.navigate(['/shopping-list', recipeId]);
  }
}
