import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFactureComponent } from './modify-facture.component';

describe('ModifyFactureComponent', () => {
  let component: ModifyFactureComponent;
  let fixture: ComponentFixture<ModifyFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
