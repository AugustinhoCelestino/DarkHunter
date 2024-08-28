import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DicerollerComponent } from "./diceroller/diceroller.component";
import { MazeGeneratorComponent } from "./maze-generator/maze-generator.component";
import { MapComponent } from "./map/map.component";
import { PartyOverlayComponent } from './party-overlay/party-overlay.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, DicerollerComponent, MazeGeneratorComponent, MapComponent, PartyOverlayComponent]
})
export class AppComponent {
  title = 'DarkHunter';
}
