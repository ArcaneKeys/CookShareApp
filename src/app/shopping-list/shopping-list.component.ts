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

  convertQuantity(quantity: number, unit: string): string {
    if (unit === 'g' && quantity >= 1000) {
      return (quantity / 1000).toFixed(1) + ' kg';
    } else if (unit === 'ml' && quantity >= 1000) {
      return (quantity / 1000).toFixed(1) + ' l';
    }
    return quantity + ' ' + unit;
  }

  generatePDF() {
    if (!this.recipe) return;

    const doc = new jsPDF();
    let yOffset = 20;

    doc.setFontSize(16);
    doc.text(`Shopping List for ${this.recipe.name}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Servings: ${this.servings}`, 10, yOffset);

    yOffset += 10;

    doc.setFontSize(10);

    this.recipe.ingredients.forEach((ingredient, index) => {
      const adjustedQuantity = this.convertQuantity(ingredient.quantity * this.servings, ingredient.unit);
      
      doc.setFont("helvetica", "bold");
      doc.text(`${ingredient.name}: `, 10, yOffset);

      doc.setFont("helvetica", "normal");
      doc.text(adjustedQuantity, doc.getTextWidth(`${ingredient.name}: `) + 10, yOffset);

      yOffset += 10;
    });

    doc.save(`shopping-list-for ${this.recipe.name}.pdf`);
  }
}
