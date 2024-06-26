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

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Booking, BookingViewModel } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { StyleService } from './style.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static data: Booking;
  constructor(private http: HttpClient, private style: StyleService)
  {}

  load(): Observable<BookingViewModel>
  {
    const style = this.style.style;
    if (style.key == "raumbelegung2021_free") {
      return of(style);
    } else {
      const jsonFile = `${environment.dataServiceUrl}`;
      return this.http.get<Booking>(jsonFile + window.location.search)
        .pipe(map(booking => ({
            title: booking.title,
            subtitle: booking.subtitle,
            participants: booking.participants,
            date: new Date(booking.from).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
            from: new Date(booking.from).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
            to: new Date(booking.to).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
        })));
    }
  }
}