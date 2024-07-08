import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrippleViewComponent } from './tripple-view.component';

describe('TrippleViewComponent', () => {
  let component: TrippleViewComponent;
  let fixture: ComponentFixture<TrippleViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrippleViewComponent]
    });
    fixture = TestBed.createComponent(TrippleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test timline item styles full hour', () => {
    expect(component).toBeTruthy();

    component.start = 10 * 60 * 60;
    component.end = 11 * 60 * 60;
    
    const style1 = component.getTimelineStyle({
      start: 10 * 60 * 60,
      end: 11 * 60 * 60
    });

    expect(style1['display']).not.toBe('none');
    expect(style1['top.%']).toBe(0);
    expect(style1['height.%']).toBe(100);
  });

  it('test timline item styles half hour A', () => {
    component.start = 10 * 60 * 60;
    component.end = 11 * 60 * 60;
    
    const style2 = component.getTimelineStyle({
      start: 10.5 * 60 * 60,
      end: 11 * 60 * 60
    });

    expect(style2['display']).not.toBe('none');
    expect(style2['top.%']).toBe(50);
    expect(style2['height.%']).toBe(50);
  });

  it('test timline item styles half hour B', () => {
    component.start = 10 * 60 * 60;
    component.end = 11 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 10 * 60 * 60,
      end: 10.5 * 60 * 60
    });

    expect(style3['display']).not.toBe('none');
    expect(style3['top.%']).toBe(0);
    expect(style3['height.%']).toBe(50);
  });

  it('test timline item styles beginning', () => {
    component.start = 13 * 60 * 60;
    component.end = 14 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 12.5 * 60 * 60,
      end: 13.5 * 60 * 60
    });

    expect(style3['display']).not.toBe('none');
    expect(style3['top.%']).toBe(0);
    expect(style3['height.%']).toBe(50);
  });

  it('test timline item styles end', () => {
    component.start = 15 * 60 * 60;
    component.end = 16 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 15.5 * 60 * 60,
      end: 16.5 * 60 * 60
    });

    expect(style3['display']).not.toBe('none');
    expect(style3['top.%']).toBe(50);
    expect(style3['height.%']).toBe(50);
  });

  it('test timline item styles beginning-end', () => {
    component.start = 16 * 60 * 60;
    component.end = 17 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 15 * 60 * 60,
      end: 18 * 60 * 60
    });

    expect(style3['display']).not.toBe('none');
    expect(style3['top.%']).toBe(0);
    expect(style3['height.%']).toBe(100);
  });

  it('test timline item styles outside 1', () => {
    component.start = 19 * 60 * 60;
    component.end = 20 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 15 * 60 * 60,
      end: 18 * 60 * 60
    });

    expect(style3['display']).toBe('none');
  });

  it('test timline item styles outside 2', () => {
    component.start = 19 * 60 * 60;
    component.end = 20 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 8 * 60 * 60,
      end: 9 * 60 * 60
    });

    expect(style3['display']).toBe('none');
  });

  it('test timline item styles invalid end', () => {
    component.start = 8 * 60 * 60;
    component.end = 9 * 60 * 60;

    const style3 = component.getTimelineStyle({
      start: 8.5 * 60 * 60,
      end: 8.2 * 60 * 60
    });

    expect(style3['display']).toBe('none');
  });

  it('test timline item styles two hours A', () => {
    expect(component).toBeTruthy();

    component.start = 10 * 60 * 60;
    component.end = 12 * 60 * 60;
    component.timelineGapPercent = 20;

    // HOUR 10:  40%
    // GAP:      20%
    // HOUR 11:  40%
    
    const style1 = component.getTimelineStyle({
      start: 10.5 * 60 * 60,
      end: 11.5 * 60 * 60
    });

    expect(style1['display']).not.toBe('none');
    expect(style1['top.%']).toBe(20);
    expect(style1['height.%']).toBe(60);
  });

  it('test timline item styles two hours B', () => {
    expect(component).toBeTruthy();

    component.start = 10 * 60 * 60;
    component.end = 12 * 60 * 60;
    component.timelineGapPercent = 20;

    // HOUR 10:  40%
    // GAP:      20%
    // HOUR 11:  40%
    
    const style1 = component.getTimelineStyle({
      start: 11.5 * 60 * 60,
      end: 12 * 60 * 60
    });

    expect(style1['display']).not.toBe('none');
    expect(style1['top.%']).toBe(80);
    expect(style1['height.%']).toBe(20);
  });

});
