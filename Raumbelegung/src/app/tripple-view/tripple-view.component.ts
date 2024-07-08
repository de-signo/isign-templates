import { Component, Input } from '@angular/core';
import { BookingViewModel } from '../data/app-data.model';
import { Time } from '@angular/common';

@Component({
  selector: 'app-tripple-view',
  templateUrl: './tripple-view.component.html',
  styleUrls: ['./tripple-view.component.scss']
})
export class TrippleViewComponent {
  @Input() items: BookingViewModel[] = [];
  @Input() date: string = "";
  @Input() globalQr: string = "";


  start: number = 8 * 60 * 60;
  end: number = 19 * 60 * 60;
  timelineGapPercent: number = 1.0;

  hours: string[] = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00"
  ];
  bookings: TimelineItem[] = [
    {
      start: 9 * 60 * 60,
      end: 10 * 60 * 60
    },
    {
      start: 11.5 * 60 * 60,
      end: 14.25 * 60 * 60
    }
  ];

  getTimelineStyle(item: TimelineItem) : { [klass: string]: any; } {
    const gapPercent = this.timelineGapPercent;

    const allSeconds = this.end - this.start;
    const topSeconds = item.start - this.start;
    const bottomSeconds = item.end - this.start;

    const allGapCount = Math.ceil(allSeconds / 3600) - 1;
    const allPercent = 100 - (gapPercent * allGapCount);
    if (allPercent <= 0)
      throw new Error("Gap is to large, no space for hours left.");
    const allSecondsWithoutGap = allSeconds / (allPercent / 100);

    const topGapCount = Math.ceil(topSeconds / 3600) - 1;
    let topPercent = 100 * topSeconds / allSecondsWithoutGap + gapPercent * topGapCount;
    const bottomGapCount = Math.ceil(bottomSeconds / 3600) - 1;
    let bottomPercent = 100 * bottomSeconds / allSecondsWithoutGap + gapPercent * bottomGapCount;
    if (topPercent < 0) topPercent = 0;
    if (bottomPercent > 100) bottomPercent = 100;

    if (bottomPercent <= 0 || topPercent > 100 || topPercent > bottomPercent) {
      return { 'display': 'none' };
    }

    return {
      'top.%': topPercent,
      'height.%': (bottomPercent - topPercent) 
    };
  }
}

interface TimelineItem {
  start: number;
  end: number;
}
