import { Component } from '@angular/core';
import { MazeGeneratorComponent } from "../maze-generator/maze-generator.component";

@Component({
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    imports: [MazeGeneratorComponent]
})
export class MapComponent {

}
