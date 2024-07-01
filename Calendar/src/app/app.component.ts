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
import { ItemViewModel } from './calendar/calendar.component';
import { Item } from './data/app-data.model';
import { DataService } from './data/data.service';
import { StyleService } from './style.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  dayTo: Date = new Date();
  dayFrom: Date = new Date();
  hourFrom = 0;
  hourTo = 23; // inklusive
  now: Date = new Date();
  days = "1";

  constructor(private dataService: DataService, public style: StyleService, route: ActivatedRoute) {
    route.queryParams.subscribe((params) => {
      this.days = params["s/days"] ?? "1";
      this.hourFrom = parseInt(params["s/startt"] ?? "0");
      this.hourTo = parseInt(params["s/endt"] ?? "24") - 1;
      this.setup();
    });
  }

  private setup() {
    const now = this.now;
    var dayStart: number;
    var dayEnd: number;
    switch (this.days) {
      default:
        dayStart = now.getDay();
        dayEnd = dayStart + parseInt(this.days) - 1;
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
      data => this.current = this.parse(data),
      error => console.error(error)
    );

    // update current time
    this.now = new Date()
    timer(0, 15000).subscribe(
      _ => this.now = new Date()
    );
  }

  private parse(input: Item[]): ItemViewModel[] {
    return input.map(i => {
      return <ItemViewModel>{
        begin: new Date(Date.parse(i.begin)),
        end: new Date(Date.parse(i.end)),
        name1: i.name1,
        name2: i.name2,
        info1: i.info1,
        info2: i.info2,
        info3: i.info3
      };
    }
    );
  }
}
