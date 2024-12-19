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

import { Component, HostBinding } from '@angular/core';
import { DataService } from './services/data.service';
import { catchError, mergeMap, retry, throwError, timer } from 'rxjs';
import { StyleService } from './services/style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly updateInterval = 300 * 1000;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  header: string = "";
  footer: string = "";
  names: string[] = [];

  @HostBinding('class.style-t1') enableStyleT1: boolean = false;
  @HostBinding('class.style-t2') enableStyleT2: boolean = false;
  @HostBinding('class.style-t3') enableStyleT3: boolean = false;
  @HostBinding('class.style-t4') enableStyleT4: boolean = false;
  @HostBinding('class.style-t5') enableStyleT5: boolean = false;

  constructor(data: DataService, style: StyleService) {
    switch (style.style.style) {
      case "t1":
        this.enableStyleT1 = true;
        break;
      case "t2":
        this.enableStyleT2 = true;
        break;
      case "t3":
        this.enableStyleT3 = true;
        break;
      case "t4":
        this.enableStyleT4 = true;
        break;
      case "t5":
        this.enableStyleT5 = true;
        break;
    }

    timer(0, this.updateInterval).pipe(
      mergeMap(() => data.load()),
      catchError((error) => {
        console.error("Failed to load data.", error);
        return throwError(() => error);
      }),
      retry({ delay: this.updateInterval})
    ).subscribe({
      next: data => {
        this.header = data?.header ?? "";
        this.footer = data?.footer ?? "";
        this.names = data?.names ?? [];
      },
      error: error => console.error(error)
    });
  }
}
