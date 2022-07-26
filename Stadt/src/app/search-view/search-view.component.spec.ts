import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';

import { SearchViewComponent } from './search-view.component';

describe('SearchViewComponent', () => {
  let component: SearchViewComponent;
  let fixture: ComponentFixture<SearchViewComponent>;
  let fakeActivatedRoute = {
    queryParams: of(convertToParamMap({ }))};
  let fakeData = { getSearchResults: (s: string) => of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchViewComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: DataService, useValue: fakeData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
