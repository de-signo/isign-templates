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

            switch (style.key) {
              case "raumbelegung2021A":
                const bookingsA = this.style.template.bindDataTable(table.slice(0,1), 
                {
                  qr: { field: "qr", default: "" },
                  title: { field: "title", default: "" },
                  subtitle: { field: "subtitile", default: "" },
                  participants: { field: "participants", convert: (v:any) => v?.split(",")},
                  from: { field: "from", default: "" },
                  to: { field: "to", default: "" }
                });
                const bookingA = bookingsA[0];
                return {
                    qr: bookingA.qr,
                    title: bookingA.title,
                    subtitle: bookingA.subtitle,
                    participants: bookingA.participants,
                    date: new Date(bookingA.from).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                    from: new Date(bookingA.from).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
                    to: new Date(bookingA.to).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
                };
              case "raumbelegung2021B":
                const bookingsB = this.style.template.bindDataTable(table.slice(0,1), 
                {
                  qr: { field: "qr", default: "" },
                  title: { field: "title", default: "" },
                  subtitle: { field: "subtitile", default: "" },
                  participants: { field: "participants", convert: (v:any) => v?.split(",")},
                  datefrom: { field: "datefrom", default: "" },
                  from: { field: "from", default: "" },
                  dateto: { field: "dateto", default: "" },
                  to: { field: "to", default: "" }
                });
                const bookingB = bookingsB[0];
                return {
                    qr: bookingB.qr,
                    title: bookingB.title,
                    subtitle: bookingB.subtitle,
                    participants: bookingB.participants,
                    date: new Date(bookingB.datefrom).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                    from: new Date(bookingB.from).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
                    to: new Date(bookingB.to).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
                };
          }
        }));
    }
  }
}