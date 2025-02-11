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
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewModelService {

  history: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.subscriptions.push(router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(event => {
      const start = <NavigationStart>event;
      if (start.navigationTrigger == "popstate")
        this.history.pop();
      else if (!router.getCurrentNavigation()?.extras?.replaceUrl)
        this.history.push(start.url);
    }));
  }

  ngOnDestroy(): void {
    for (var sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  reset() {
    this.router.navigate(["/"], { queryParamsHandling:"preserve" });
  }

  clear() {
    this.history = [];
  }
}
