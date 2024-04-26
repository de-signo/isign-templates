/* 
 *  Copyright (C) 2024 DE SIGNO GmbH
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

import { ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { from, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BookingViewModel } from './data/app-data.model';
import { DataService } from './data/data.service';
import { StyleService } from './data/style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent  implements OnInit {
  @ViewChild('scrollcontainer') scrollcontainer !: ElementRef;
  scrollingState : "down"|"downdelay"|"up"|"updelay" = "downdelay";
  scrollingCounter = 0;

  view: "single" | "double";  
  @HostBinding('class.view-single') get enableViewSingle() { return this.view == "single"; }
  @HostBinding('class.view-double') get enableViewDouble() { return this.view == "double"; }

  currentDate: string;

  constructor(
    private readonly dataService: DataService,
    style: StyleService
  ) {
    var styleKey = style.style.key;
    switch (styleKey) {
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
    }
    this.currentDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  current: BookingViewModel[] | null = null;

  ngOnInit(): void {
    timer(0, 10 * 1000).pipe(
      mergeMap(() => {
        this.currentDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
        return this.dataService.load();
      })
    ).subscribe({
      next: data => this.current = data,
      error: error => console.error("Failed to load data.", error)
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
