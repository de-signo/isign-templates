/* 
 *  Copyright (C) 2025 DE SIGNO GmbH
 *  
 *  This program is dual licensed. If you did not license the program under
 *  different terms, the following applies:
 *  
 *  This program is free software: You can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *  
 */

import { ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { throwError, timer } from 'rxjs';
import { catchError, mergeMap, retry } from 'rxjs/operators';
import { BookingViewModel } from './data/app-data.model';
import { DataService } from './data/data.service';
import { StyleService } from './data/style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent  implements OnInit {
  private readonly updateInterval = 30 * 1000;
  @ViewChild('scrollcontainer') scrollcontainer !: ElementRef;
  scrollingState : "down"|"downdelay"|"up"|"updelay" = "downdelay";
  scrollingCounter = 0;

  view: "single" | "double" | "tripple";
  currentDate: string;
  globalQr: string;
  roomName: string;

  constructor(
    private readonly dataService: DataService,
    styleSvc: StyleService,
    @Inject(LOCALE_ID) private readonly locale: string
  ) {
    const style = styleSvc.style;
    switch (style.key) {
      case "raumbelegung2021A":
      case "raumbelegung2021B":
      case "raumbelegung2021_free":
        this.view = "single";
        break;
      case "raumbelegung_2_A":
      case "raumbelegung_2_B":
      case "raumbelegung_2_free":
        this.view = "double";
        break;
      case "raumbelegung_3_A":
      case "raumbelegung_3_B":
        this.view = "tripple";
        break;
    }
    this.currentDate = new Date().toLocaleDateString(this.locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
    this.globalQr = style.globalQr;
    this.roomName = style.roomName;
  }

  current: BookingViewModel[] = []; 

  ngOnInit(): void {
    timer(0, this.updateInterval).pipe(
      mergeMap(() => {
        this.currentDate = new Date().toLocaleDateString(this.locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
        return this.dataService.load();
      }),
      catchError((error) => {
        console.error("Failed to load data.", error);
        return throwError(() => error);
      }),
      retry({ delay: this.updateInterval})
    ).subscribe({
      next: data => this.current = data ?? [],
      error: error => console.error("Finally failed to load data.", error)
    });

    timer(0, 50).subscribe(
      _ => {
        if (!this.scrollcontainer) return;
        const scrollHeight = this.scrollcontainer.nativeElement.scrollHeight;
        const clientHeight = this.scrollcontainer.nativeElement.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        var top = this.scrollcontainer.nativeElement.scrollTop;
        switch (this.scrollingState) {
          case "down": {
            const scrollStep = clientHeight / 5 / (1000 / 50); // 5 seconds for one time height
            top += scrollStep;
            if (top > maxScroll) {
              top = maxScroll;
              this.scrollingState = "downdelay";
              this.scrollingCounter = 2 * (1000 / 50); // 2 seconds
            }
            break;
          }
          case "downdelay": {
            top = maxScroll;
            this.scrollingCounter--;
            if (this.scrollingCounter <= 0)
              this.scrollingState = "up";
              break;
          }
          case "up": {
            const scrollStep = clientHeight / 1 / (1000 / 50); // 1 second for one time height
            top -= scrollStep;
            if (top <= 0) {
              top = 0;
              this.scrollingState = "updelay";
              this.scrollingCounter = 2 * (1000 / 50); // 2 seconds
            }
            break;
          }
          case "updelay": {
            top = 0;
            this.scrollingCounter--;
            if (this.scrollingCounter <= 0)
              this.scrollingState = "down";
              break;
          }
        }
        this.scrollcontainer.nativeElement.scrollTop = top;
      }
    )
  }
}
