import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnChanges, OnInit {
  @Input() hourFrom: number = 0;  // inclusive
  @Input() hourTo: number = 23;   // inclusive
  @Input() dateFrom: Date = new Date();  // inclusive
  @Input() dateTo: Date = new Date();    // inclusive

  @Input() items: ItemViewModel[] = [];

  now: Date = new Date();
  days: DayViewModel[] = [];
  hours: Date[] = [];

  constructor() { }

  ngOnInit(): void {
    // update current time
    timer(0, 15000).subscribe(
      _ => this.now = new Date()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dateFrom = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate());
    let dateTo = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), this.dateTo.getDate());
    if (dateTo < dateFrom) dateTo = dateFrom;

    const hourFrom = new Date(0, 0, 0, this.hourFrom);
    let hourToN = this.hourTo;
    if (hourToN < this.hourFrom) hourToN = this.hourFrom;
    const hourTo = new Date(0, 0, 0, hourToN);

    const dayCount = (+dateTo - +dateFrom) / (24 * 60 * 60 * 1000) + 1;
    this.days = [...Array(dayCount).keys()].map(i => {
      const date = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() + i);
      return <DayViewModel>{
        date: date,
        begin: new Date(+date + this.hourFrom * 60 * 60 * 1000),
        end: new Date(+date + (hourToN + 1) * 60 * 60 * 1000),
      };
    });

    const hourCount = (+hourTo - +hourFrom) / (60 * 60 * 1000) + 1;
    this.hours = [...Array(hourCount).keys()].map(i => new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), this.hourFrom + i));
  }

  isMatch(day: DayViewModel, hour: Date, now: Date): boolean {
    return hour.getHours() == now.getHours() &&
           day.date.getDate() == now.getDate()  &&
           day.date.getMonth() == now.getMonth() &&
           day.date.getFullYear() == now.getFullYear();
  }

  getItems(day: DayViewModel, hour: Date): ItemViewModel[] {
    // todo: start is before begin, but end is inside
    return this.items.filter(i => this.isMatch(day, hour, i.begin));
  }

  getTop(date: Date): number {
    if (!this.hours.length)
      return 0;

    const seconds = date.getMinutes() * 60 + date.getSeconds();
    const perc = 100 * seconds / (60 * 60);
    if (perc > 100.0)
      return 100.0;
    return perc;
  }

  getHeight(day: DayViewModel, item: ItemViewModel): number {
    if (!this.hours.length)
      return 0;

    let begin = item.begin;
    let end = item.end;
    if (begin < day.begin) begin = day.begin;
    if (end > day.end) end = day.end;
    const duration = +end - +begin;
    if (duration < 0)
      return 0;

    return 100 * duration / (60 * 60 * 1000);
  }
}

interface DayViewModel {
  date: Date;
  begin: Date;
  end: Date;
}
export interface ItemViewModel {
  begin: Date;
  end: Date;
  name1: string;
  name2: string;
  info1: string;
  info2: string;
  info3: string;
}
