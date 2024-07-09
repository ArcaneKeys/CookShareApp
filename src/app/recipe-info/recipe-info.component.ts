import { Component, Input } from '@angular/core';
import { Recipe } from '../models/recipe.model'

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css'
})
export class RecipeInfoComponent {
  @Input() recipe!: Recipe;
}
