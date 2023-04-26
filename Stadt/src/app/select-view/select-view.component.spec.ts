import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';

import { SelectViewComponent } from './select-view.component';

describe('SelectViewComponent', () => {
  let component: SelectViewComponent;
  let fixture: ComponentFixture<SelectViewComponent>;
  let fakeActivatedRoute = {
    params: of(convertToParamMap({ }))};
  let fakeData = { tree: of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectViewComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: DataService, useValue: fakeData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
