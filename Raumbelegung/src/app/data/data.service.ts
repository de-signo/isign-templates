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

import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { BookingViewModel } from './app-data.model';
import { StyleService } from './style.service';
import { DataImportService } from '@isign/isign-services';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private readonly style: StyleService,
    private readonly dataImport: DataImportService,
    @Inject(LOCALE_ID) private readonly locale: string)
  {}

  private readDateFromCombinedValue(dateTime: string, timezoneOffset?: number): Date {
    const originalDate = new Date(dateTime);

    // Convert to local timezone
    if (!timezoneOffset) {
      // automatically convert specified timezone to local time
      timezoneOffset =
        (new Date().getTimezoneOffset()) - // target tz
        originalDate.getTimezoneOffset() // source tz
    }
    return new Date(originalDate.getTime() - timezoneOffset);
  }

  private readDateFromSplitValues(date: string, time: string, timezoneOffset?: number): Date {
    const originalDate = new Date(date);
    const [hours, minutes, seconds = 0] = time.split(':').map(Number);
  
    // Convert to local timezone
    if (!timezoneOffset) {
      // automatically convert specified timezone to local time
      timezoneOffset =
        (new Date().getTimezoneOffset()) - // target tz
        originalDate.getTimezoneOffset() // source tz
    }
    return new Date(originalDate.getTime() + hours * 3600000 + minutes * 60000 + seconds * 1000 - timezoneOffset);
  }

  load(): Observable<BookingViewModel[]|null>
  {
    const style = this.style.style;
    const key = style.key;
    if (key == "raumbelegung2021_free"
     || key == "raumbelegung_2_free") {
      return of([style]);
    } else {
      const diId = this.style.template.parameters["s"];
      if (!diId)
        throw Error("Data source id is missing.");

      const tz = this.style.template.parameters["tz"];
      const timezoneOffset =
        (tz == "utc") ? new Date().getTimezoneOffset() * 60000 :
        (tz == "srv") ? 0 :
        undefined;

      return this.dataImport.getDataTable(diId)
        .pipe(
          map(table => {
            if (!table?.length) {
              return null;
            }

            const maxCount = (key === "raumbelegung_2_A" || key === "raumbelegung_2_B") ? 2 : 1;
            switch (key) {
              case "raumbelegung2021A":
              case "raumbelegung_2_A":
                return this.style.template.bindDataTable(table.slice(0, maxCount), 
                {
                  qr: { field: "qr", default: "" },
                  title: { field: "title", default: "" },
                  subtitle: { field: "subtitle", default: "" },
                  participants: { field: "participants", convert: (v:any) => v?.split(",")},
                  from: { field: "from", default: "" },
                  to: { field: "to", default: "" }
                }).map(bookingA => {
                  const from = this.readDateFromCombinedValue(bookingA.from, timezoneOffset);
                  return <BookingViewModel>({
                  qr: bookingA.qr,
                  title: bookingA.title,
                  subtitle: bookingA.subtitle,
                  participants: bookingA.participants,
                  date: from.toLocaleDateString(this.locale, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                  from: from.toLocaleTimeString(this.locale, { hour: "2-digit", minute: "2-digit" }),
                  to: this.readDateFromCombinedValue(bookingA.to, timezoneOffset).toLocaleTimeString(this.locale, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
                })});
              case "raumbelegung2021B":
              case "raumbelegung_2_B":
                return this.style.template.bindDataTable(table.slice(0, maxCount), 
                {
                  qr: { field: "qr", default: "" },
                  title: { field: "title", default: "" },
                  subtitle: { field: "subtitle", default: "" },
                  participants: { field: "participants", convert: (v:any) => v?.split(",")},
                  datefrom: { field: "datefrom", default: "" },
                  from: { field: "from", default: "" },
                  dateto: { field: "dateto", default: "" },
                  to: { field: "to", default: "" }
                }).map(bookingB => {
                  const from = this.readDateFromSplitValues(bookingB.datefrom, bookingB.from, timezoneOffset)
                  return <BookingViewModel>({
                    qr: bookingB.qr,
                    title: bookingB.title,
                    subtitle: bookingB.subtitle,
                    participants: bookingB.participants,
                    date: from.toLocaleDateString(this.locale, { year: 'numeric', month: '2-digit', day: '2-digit' }),
                    from: from.toLocaleTimeString(this.locale, { hour: "2-digit", minute: "2-digit" }),
                    to: this.readDateFromSplitValues(bookingB.dateto, bookingB.to, timezoneOffset).toLocaleTimeString(this.locale, { hour: "2-digit", minute: "2-digit" }) + " Uhr"
                })});
          }
        }));
    }
  }
}