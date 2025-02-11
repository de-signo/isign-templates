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
import { ItemViewModel } from './app-data.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataImportService } from '@isign/isign-services';
import { StyleService } from './style.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private readonly dataImport: DataImportService,
    private readonly style: StyleService) { }

  load(): Observable<ItemViewModel[]> {

    if (!this.style.style.dataSourceID)
      throw Error("Data source id is missing.");

    return this.dataImport.getDataTable(this.style.style.dataSourceID).pipe(
      map(table => {
        if (!table?.length) {
          return [];
        }

        return this.style.template.bindDataTable(table, {
          'begin': { field: 'begin', convert: (value: any) => new Date(Date.parse(value)) },
          'end': { field: 'end', convert: value => new Date(Date.parse(value)) },
          'name1': { field: 'name1', default: "" },
          'name2': { field: 'name2', default: "" },
          'info1': { field: 'info1', default: "" },
          'info2': { field: 'info2', default: "" },
          'info3': { field: 'info3', default: "" },
        });
      }));
  }
}
