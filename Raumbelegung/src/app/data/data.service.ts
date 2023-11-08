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
import { BookingViewModel } from './app-data.model';
import { StyleService } from './style.service';
import { DataImportService } from '@isign/isign-services';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private style: StyleService, private dataImport: DataImportService)
  {}

  load(): Observable<BookingViewModel|null>
  {
    const style = this.style.style;
    if (style.key == "raumbelegung2021_free") {
      return of(style);
    } else {
      const diId = this.style.template.parameters["s"];
      if (!diId)
        throw Error("Data source id is missing.");

      return this.dataImport.getDataTable(diId)
        .pipe(
          map(table => {
            if (!table?.length) {
              return null;
            }
            const bookings = this.style.template.bindDataTable(table.slice(0,1), 
              {
                title: { field: "title", default: "" },
                subtitle: { field: "subtitile", default: "" },
                participants: { field: "participants", convert: (v:any) => v?.split(",")},
                from: { field: "from", default: "" },
                to: { field: "to", default: "" }
              });
            const booking = bookings[0];
            return {
                title: booking.title,
                subtitle: booking.subtitle,
                participants: booking.participants,
                date: new Date(booking.from).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                from: new Date(booking.from).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
                to: new Date(booking.to).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
            };
        }));
    }
  }
}