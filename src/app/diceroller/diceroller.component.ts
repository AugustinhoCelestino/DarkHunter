import { Component } from '@angular/core';

@Component({
  selector: 'app-diceroller',
  standalone: true,
  imports: [],
  templateUrl: './diceroller.component.html',
  styleUrl: './diceroller.component.scss',
})
export class DicerollerComponent {
  // variables
  diceResults: number[] = [0];

  rollDice(): void {
    this.diceResults.push(Math.floor(Math.random() * 6) + 1);
  }
}
