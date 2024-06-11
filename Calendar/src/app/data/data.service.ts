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
import { Item } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items: Item[] = [];

  constructor(private http: HttpClient)
  {}

  load(): Observable<Item[]>
  {
    const jsonFile = environment.dataServiceUrl;
    return this.http.get<Item[]>(jsonFile + window.location.search)
      .pipe(tap(data => {
        this.items = data;
      }));
  }

  getItems(): Observable<Item[]> {
    if (this.items.length == 0)
      return this.load();
    else
      return of(this.items);
  }
}
