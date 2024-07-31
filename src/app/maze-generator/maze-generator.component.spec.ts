import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeGeneratorComponent } from './maze-generator.component';

describe('MazeGeneratorComponent', () => {
  let component: MazeGeneratorComponent;
  let fixture: ComponentFixture<MazeGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MazeGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MazeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
