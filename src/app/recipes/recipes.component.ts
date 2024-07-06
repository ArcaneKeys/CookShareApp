import { Component } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent {
  recipes = [
    {
      id: 1,
      name: 'Spaghetti Carbonara',
      ingredients: 'Spaghetti, Eggs, Parmesan, Bacon',
      instructions: 'Cook spaghetti. Mix eggs and parmesan. Fry bacon. Combine all.',
      pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967586-v-1080x1080.jpg'
    },
    {
      id: 2,
      name: 'Chicken Curry',
      ingredients: 'Chicken, Curry Paste, Coconut Milk',
      instructions: 'Cook chicken. Add curry paste and coconut milk. Simmer.',
      pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967553-v-1080x1080.jpg'
    },
    {
      id: 3,
      name: 'Beef Stroganoff',
      ingredients: 'Beef, Onions, Mushrooms, Sour Cream',
      instructions: 'Cook beef. Add onions and mushrooms. Stir in sour cream.',
      pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/11/9751896-v-1080x1080.jpg'
    }
  ];
}
