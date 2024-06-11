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
import { IAppConfig } from './app-config.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private settingsSubject: BehaviorSubject<IAppConfig|undefined> = new BehaviorSubject<IAppConfig|undefined>(undefined);
  settings: Observable<IAppConfig|undefined> = this.settingsSubject.asObservable();
  constructor(private http: HttpClient) {}

  async load() : Promise<void> {
    const jsonFile = `${environment.config}`;
    const response = await this.http.get<IAppConfig>(jsonFile).toPromise();
    this.settingsSubject.next(response);
  }
}
