import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoForoComponent } from './nuevo-foro.component';

describe('NuevoForoComponent', () => {
  let component: NuevoForoComponent;
  let fixture: ComponentFixture<NuevoForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoForoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
