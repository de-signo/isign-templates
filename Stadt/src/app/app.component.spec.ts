import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Idle } from '@ng-idle/core';
import { NEVER, of } from 'rxjs';
import { AppComponent } from './app.component';
import { DataService } from './data/data.service';

describe('AppComponent', () => {
  let fakeData = { };
  let fakeIdle = {
    setIdle: (x: number) => {},
    setTimeout: (x: number) => {},
    setInterrupts: (x: number) => {},
    onTimeout: NEVER,
    watch: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: DataService, useValue: fakeData },
        { provide: Idle, useValue: fakeIdle }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
