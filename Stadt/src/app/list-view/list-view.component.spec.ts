import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';

import { ListViewComponent } from './list-view.component';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let fakeActivatedRoute = {
    queryParams: of(convertToParamMap({ }))};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListViewComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
