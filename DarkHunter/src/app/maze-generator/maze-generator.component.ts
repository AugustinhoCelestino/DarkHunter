import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface MazeCell {
  x: number;
  y: number;
  visited?: boolean;
  border_top?: boolean;
  border_right?: boolean;
  border_bottom?: boolean;
  border_left?: boolean;
  dead_end?: boolean;
  queue_size?: number;
  treasure?: boolean;
  maze_end?: boolean;
  monster_chance?: number;
  monster?: boolean;
  fae_route?: boolean;
}

@Component({
  selector: 'app-maze-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maze-generator.component.html',
  styleUrl: './maze-generator.component.scss',
})
export class MazeGeneratorComponent implements OnInit {
  maze_done: boolean = false;
  maze: MazeCell[][] = [];
  maze_width: number = 3;
  maze_height: number = 3;
  start_maze_cell: MazeCell = { x: 0, y: 0 };
  maze_queue: MazeCell[] = [];
  near_valid_cells: MazeCell[] = [];
  maze_cells_count: number = 0;
  cell_visited: number = 0;
  player_tile: MazeCell = { x: 0, y: 0 };
  player_movements: MazeCell[] = [];
  treasures: boolean = true;
  treasures_count: number = 0;
  maze_queue_end: number = 0;
  maze_queue_biggest: number = 0;
  maze_queue_solution: MazeCell[] = [];
  maze_monster_count: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.createMazeStructure();
    this.selectStartCell();
    this.startQueue();
    this.generateNearCells();

    while (!this.maze_done) {
      this.mazeNextTile();
    }

    this.markMonster();
    this.setPlayerTile(this.start_maze_cell);
    console.log(this.maze_queue_end);
    console.log(this.maze_queue_solution);
    console.log(this.maze_monster_count);
    this.markFaeRoute();
  }

  createMazeStructure(): void {
    let line_value: MazeCell[] = [];
    for (let h = 1; h <= this.maze_height; h++) {
      for (let w = 1; w <= this.maze_width; w++) {
        line_value.push({
          x: h,
          y: w,
          border_top: true,
          border_right: true,
          border_bottom: true,
          border_left: true,
        });
      }
      this.maze.push(line_value);
      line_value = [];
    }
    this.maze_cells_count = this.maze_width * this.maze_height;
  }

  selectStartCell(): void {
    this.start_maze_cell = {
      x: this.getRandomInt(this.maze_height),
      y: this.getRandomInt(this.maze_width),
    };
  }

  getRandomInt(maxValue: number): number {
    return Math.floor(Math.random() * maxValue) + 1;
  }

  checkStartCell(_x: number, _y: number): boolean {
    return _x == this.start_maze_cell.x && _y == this.start_maze_cell.y;
  }

  checkMovimentPlayerCell(_x: number, _y: number): boolean {
    let moviment_cell = this.player_movements.find(
      (find_cell) => find_cell.x === _x && find_cell.y === _y
    );
    return moviment_cell != undefined;
  }

  checkNearCells(_x: number, _y: number): boolean {
    let near_cell = this.near_valid_cells.find(
      (find_cell) => find_cell.x === _x && find_cell.y === _y
    );
    return near_cell != undefined;
  }

  checkCellVisited(_cell: MazeCell): boolean {
    return this.maze[_cell.x - 1][_cell.y - 1].visited || false;
  }

  startQueue(): void {
    this.maze_queue.push(this.start_maze_cell);
  }

  generateNearCells(): void {
    this.markVisited();
    this.checkMazeDone();
    this.near_valid_cells = [];

    let first_queue_cell: MazeCell =
      this.maze_queue[this.maze_queue.length - 1];

    if (first_queue_cell.x != 1) {
      let x_minus: MazeCell = {
        x: first_queue_cell.x - 1,
        y: first_queue_cell.y,
      };
      if (!this.checkCellVisited(x_minus)) {
        this.near_valid_cells.push(x_minus);
      }
    }
    if (first_queue_cell.y != 1) {
      let y_minus: MazeCell = {
        x: first_queue_cell.x,
        y: first_queue_cell.y - 1,
      };
      if (!this.checkCellVisited(y_minus)) {
        this.near_valid_cells.push(y_minus);
      }
    }
    if (first_queue_cell.x != this.maze_height) {
      let x_plus: MazeCell = {
        x: first_queue_cell.x + 1,
        y: first_queue_cell.y,
      };
      if (!this.checkCellVisited(x_plus)) {
        this.near_valid_cells.push(x_plus);
      }
    }
    if (first_queue_cell.y != this.maze_width) {
      let y_plus: MazeCell = {
        x: first_queue_cell.x,
        y: first_queue_cell.y + 1,
      };
      if (!this.checkCellVisited(y_plus)) {
        this.near_valid_cells.push(y_plus);
      }
    }
  }

  mazeNextTile(): void {
    if (this.near_valid_cells.length == 0) {
      if (this.maze_queue_end < this.maze_queue.length) {
        this.maze_queue_end = this.maze_queue.length;
        this.maze_queue_solution = [...this.maze_queue];
        this.markMakeEnd();
      }
      if (this.treasures) {
        this.markTreasure();
        this.treasures = false;
      }

      this.markDeadEnd();
      this.maze_queue.pop();
      this.generateNearCells();
      this.mazeNextTile();
      return;
    }
    this.treasures = true;

    let next_cell: MazeCell =
      this.near_valid_cells[
        this.getRandomInt(this.near_valid_cells.length) - 1
      ];

    this.breakWall(this.maze_queue[this.maze_queue.length - 1], next_cell);

    this.maze_queue.push(next_cell);

    this.generateNearCells();
  }

  markVisited(): void {
    let first_queue_cell: MazeCell =
      this.maze_queue[this.maze_queue.length - 1];
    this.maze[first_queue_cell.x - 1][first_queue_cell.y - 1].visited = true;
    this.maze[first_queue_cell.x - 1][first_queue_cell.y - 1].queue_size =
      this.maze_queue.length;
  }

  markDeadEnd(): void {
    let first_queue_cell: MazeCell =
      this.maze_queue[this.maze_queue.length - 1];
    this.maze[first_queue_cell.x - 1][first_queue_cell.y - 1].dead_end = true;
  }

  markTreasure(): void {
    let first_queue_cell: MazeCell =
      this.maze_queue[this.maze_queue.length - 1];
    this.maze[first_queue_cell.x - 1][first_queue_cell.y - 1].treasure = true;
    this.treasures_count++;
  }

  markMakeEnd(): void {
    this.maze.forEach((x) => {
      x.forEach((y) => (y.maze_end = false));
    });
    let first_queue_cell: MazeCell =
      this.maze_queue[this.maze_queue.length - 1];
    this.maze[first_queue_cell.x - 1][first_queue_cell.y - 1].maze_end = true;
  }

  markMonster(): void {
    this.maze.forEach((maze_line) => {
      maze_line.forEach((maze_cell) => {
        maze_cell.monster_chance = Math.floor(
          50 * ((maze_cell.queue_size || 0) / this.maze_queue_end)
        );

        let startcell = this.checkStartCell(maze_cell.x, maze_cell.y);

        if (maze_cell.monster_chance > this.getRandomInt(100) || maze_cell.maze_end && !startcell) {
          maze_cell.monster = true;
          this.maze_monster_count++;
        }

      });
    });
  }

  markFaeRoute(): void {
    this.maze.forEach((maze_line) => {
      maze_line.forEach((maze_cell) => {
        if (
          this.maze_queue_solution.some(
            (cell) => cell.x == maze_cell.x && cell.y == maze_cell.y
          )
        ) {
          maze_cell.fae_route = true;
        }
      });
    });
  }
  breakWall(_cell_a: MazeCell, _cell_b: MazeCell): void {
    // Check Verical Moviment;
    if (_cell_a.x == _cell_b.x) {
      // Moviment = R to L
      if (_cell_a.y < _cell_b.y) {
        // A break R
        this.maze[_cell_a.x - 1][_cell_a.y - 1].border_right = false;
        // B break L
        this.maze[_cell_b.x - 1][_cell_b.y - 1].border_left = false;
      }
      // Moviment = L to R
      else {
        // A break L
        this.maze[_cell_a.x - 1][_cell_a.y - 1].border_left = false;
        // B break R
        this.maze[_cell_b.x - 1][_cell_b.y - 1].border_right = false;
      }
    }
    // ELSE is Horizontal Moviment
    else {
      // Moviment = Top to Bottom
      if (_cell_a.x < _cell_b.x) {
        // A break Bottom
        this.maze[_cell_a.x - 1][_cell_a.y - 1].border_bottom = false;
        // B break Top
        this.maze[_cell_b.x - 1][_cell_b.y - 1].border_top = false;
      }
      // Moviment = Bottom to Top
      else {
        // A break Top
        this.maze[_cell_a.x - 1][_cell_a.y - 1].border_top = false;
        // B break Bottom
        this.maze[_cell_b.x - 1][_cell_b.y - 1].border_bottom = false;
      }
    }
  }

  checkMazeDone(): void {
    this.cell_visited = 0;

    this.maze.forEach((maze_line) => {
      maze_line.forEach((maze_cell) => {
        if (maze_cell.visited) this.cell_visited++;
      });
    });

    this.maze_done = this.cell_visited === this.maze_cells_count;
  }

  generateTopSCSS(): string {
    return (
      'calc(50% + 10vh + 10px - (' +
      this.player_tile.x +
      ' * 20vh) - (' +
      this.player_tile.x +
      ' * 20px))'
    );
  }

  generateLeftSCSS(): string {
    return 'calc(50% + 10vh - 10px - (' + this.player_tile.y + ' * 20vh) ';
  }

  setPlayerTile(_cell: MazeCell): void {
    this.player_tile.x = _cell.x;
    this.player_tile.y = _cell.y;
    this.generatePlayerMoviment();
  }

  generatePlayerMoviment(): void {
    this.player_movements = [];
    let maze_player_cell =
      this.maze[this.player_tile.x - 1][this.player_tile.y - 1];

    if (maze_player_cell.border_bottom == false) {
      let bottom_cell: MazeCell = {
        x: maze_player_cell.x + 1,
        y: maze_player_cell.y,
      };
      if (this.isValidCell(bottom_cell)) {
        this.player_movements.push(bottom_cell);
      }
    }
    if (maze_player_cell.border_top == false) {
      let top_cell: MazeCell = {
        x: maze_player_cell.x - 1,
        y: maze_player_cell.y,
      };
      if (this.isValidCell(top_cell)) {
        this.player_movements.push(top_cell);
      }
    }
    if (maze_player_cell.border_left == false) {
      let left_cell: MazeCell = {
        x: maze_player_cell.x,
        y: maze_player_cell.y - 1,
      };
      if (this.isValidCell(left_cell)) {
        this.player_movements.push(left_cell);
      }
    }
    if (maze_player_cell.border_right == false) {
      let right_cell: MazeCell = {
        x: maze_player_cell.x,
        y: maze_player_cell.y + 1,
      };
      if (this.isValidCell(right_cell)) {
        this.player_movements.push(right_cell);
      }
    }
  }

  sameTile(tile_a: MazeCell, tile_b: MazeCell): boolean {
    return tile_a.x == tile_b.x && tile_a.y == tile_b.y;
  }

  isValidCell(_cell: MazeCell): boolean {
    return (
      _cell.x > 0 &&
      _cell.x <= this.maze_width &&
      _cell.y > 0 &&
      _cell.y <= this.maze_width
    );
  }
}
