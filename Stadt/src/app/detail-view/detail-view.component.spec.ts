import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';

import { DetailViewComponent } from './detail-view.component';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;
  let fakeData = { tree: of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailViewComponent ],
      providers: [
        { provide: DataService, useValue: fakeData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
