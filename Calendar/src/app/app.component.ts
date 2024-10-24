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

import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DataService } from './data/data.service';
import { StyleModel, StyleService } from './data/style.service';
import { ItemViewModel } from './data/app-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  dayTo: Date;
  dayFrom: Date;
  now: Date = new Date();
  style: StyleModel;

  constructor(
    private dataService: DataService,
    private readonly styleService: StyleService) {

    const style = this.styleService.style;
    this.style = style;
    const now = this.now;
    var dayStart: number;
    var dayEnd: number;
    switch (style.days) {
      default:
        dayStart = now.getDay();
        dayEnd = dayStart + parseInt(style.days) - 1;
        break;
      case "MO-FR":
        dayStart = 1;
        dayEnd = 5;
        break;
      case "MO-SA":
        dayStart = 1;
        dayEnd = 6;
        break;
      case "MO-SO":
        dayStart = 1;
        dayEnd = 7;
        break;
      case "SO-SA":
        dayStart = 0;
        dayEnd = 6;
        break;
    }
    this.dayTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (dayEnd - now.getDay()));
    this.dayFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (dayStart - now.getDay()));
  }

  current: ItemViewModel[] = [];

  ngOnInit(): void {
    timer(0, 60* 60 * 1000).pipe(
      mergeMap(() => this.dataService.load())
    ).subscribe(
      data => this.current = data,
      error => console.error(error)
    );

    // update current time
    this.now = new Date()
    timer(0, 15000).subscribe(
      _ => this.now = new Date()
    );
  }
}
