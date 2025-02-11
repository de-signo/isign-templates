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

import { Injectable } from '@angular/core';
import { DoorModel } from './app-data.model';
import { Observable, map, of } from 'rxjs';
import { StyleService } from './style.service';
import { DataImportService } from '@isign/isign-services';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private dataImport: DataImportService, 
    private style: StyleService)
  {}

  load(): Observable<DoorModel|null> {
    const style = this.style.style;

    if (style.key == "std_door1_free") {
      return of({
        header: style.header,
        footer: style.footer,
        names: style.names
      });
    }
    else {
      return this.dataImport.getDataTable(style.datasource).pipe(
        map(table => {
          if (!table?.length) {
            return null;
          }

          return this.style.template.bindDataTable(table.slice(0, 1), {
            header: { field: "header", default: "" },
            footer: { field: "footer", default: "" },
            names: { field: "names", convert: (v:any) => v?.split(";")}
          })[0];
        })); 
    }
  }
}

type DataImportModel = {[key: string]: any}[];