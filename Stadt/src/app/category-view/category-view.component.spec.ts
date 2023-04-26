import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';
import { ViewModelService } from '../data/view-model.service';

import { CategoryViewComponent } from './category-view.component';

describe('CategoryViewComponent', () => {
  let component: CategoryViewComponent;
  let fixture: ComponentFixture<CategoryViewComponent>;
  let fakeActivatedRoute = {
    queryParams: of(convertToParamMap({ }))};
  let fakeData = { tree: of([]) };
  let fakeVM = { clear: ()=>{} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryViewComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: DataService, useValue: fakeData },
        { provide: ViewModelService, useValue: fakeVM },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
