import { Component, Input } from '@angular/core';
import { BookingViewModel } from '../data/app-data.model';
import { TemplateService } from '@isign/forms-templates';

@Component({
  selector: 'app-tripple-view',
  templateUrl: './tripple-view.component.html',
  styleUrls: ['./tripple-view.component.scss']
})
export class TrippleViewComponent {
  @Input() date: string = "";
  @Input() globalQr: string = "";
  @Input() roomName: string = "";

  @Input()
  get items(): BookingViewModel[] {
    return this._items;
  }

  set items(value: BookingViewModel[]) {
    this._items = value;
    this.listItems = value.slice(0, 3);
  }

  private _items: BookingViewModel[] = [];
  listItems: BookingViewModel[] = [];
  start: number = 8 * 60 * 60;
  end: number = 19 * 60 * 60;
  timelineGapPercent: number = 1.0;
  hours: string[];
  fontSizeValue: number | undefined;

  constructor(ts: TemplateService) {
    const tmpl = ts.getTemplate();
    const startH = Number.parseInt(tmpl.parameters["tlstart"] ?? "0");
    const endH = Number.parseInt(tmpl.parameters["tlend"] ?? "24");
    this.hours = TrippleViewComponent.calcHours(startH, endH);
    this.fontSizeValue = this.calcFontSize(startH, endH);
    this.start = startH * 3600;
    this.end = endH * 3600;
  }

  calcFontSize(start: number, end: number): number {
    const hoursAmount = end - start;
    const minFontSize = 0.5;
    const maxFontSize = 1.0;
    const maxHours = 24;
    let fontSize = maxFontSize - (hoursAmount / maxHours) * (maxFontSize - minFontSize);
    return fontSize;
  }

  static calcHours(start: number, end: number) {
    let hours = <string[]>[];
    for (let hour = start; hour < end; hour++) {
      hours.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return hours;
  }

  getTimelineStyle(item: TimelineItem): { [klass: string]: any; } {
    const gapPercent = this.timelineGapPercent;

    const allSeconds = this.end - this.start;
    const topSeconds = item.fromSeconds - this.start;
    const bottomSeconds = item.toSeconds - this.start;

    const allGapCount = Math.ceil(allSeconds / 3600) - 1;
    const allPercent = 100 - (gapPercent * allGapCount);
    if (allPercent <= 0)
      throw new Error("Gap is too large, no space for hours left.");
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
  fromSeconds: number;
  toSeconds: number;
}
