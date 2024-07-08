import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css'
})
export class RecipeInfoComponent {
  @Input() recipe: any;
}
