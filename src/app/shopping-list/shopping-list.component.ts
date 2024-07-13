import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  recipe: Recipe | null = null;
  servings: number = 1;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.recipeService.getRecipeById(id).subscribe({
      next: recipe => {
        this.recipe = recipe;
        this.errorMessage = null;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load the recipe. Please try again later.';
      }
    });
  }

  updateServings(event: any) {
    this.servings = event.target.value;
  }

  generatePDF() {
    if (!this.recipe) return;

    const doc = new jsPDF();

    doc.text(`Shopping List for ${this.recipe.name}`, 10, 10);
    doc.text(`Servings: ${this.servings}`, 10, 20);

    this.recipe.ingredients.forEach((ingredient, index) => {
      const adjustedQuantity = (ingredient.quantity * this.servings).toFixed(2);
      doc.text(`${ingredient.name}: ${adjustedQuantity} ${ingredient.unit}`, 10, 30 + (index * 10));
    });

    doc.save('shopping-list.pdf');
  }
}
