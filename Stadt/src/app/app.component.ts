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

import { HostListener, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Subscription, timer } from 'rxjs';
import { DataService } from './data/data.service';
import { ViewModelService } from './data/view-model.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, idle: Idle, private vm: ViewModelService) {
    idle.setIdle(20);
    idle.setTimeout(20);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.vm.reset();
      idle.watch();
    });
    idle.watch();
  }

  ngOnInit(): void {
    this.subscriptions.push(timer(60 * 60 * 1000, 60* 60 * 1000).subscribe(_ => this.dataService.refresh()));
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  @HostListener("touchstart", ["$event"])
  touchHandler(event: any) {
    if(event.touches.length > 1) {
        // prevent mult touch
        event.preventDefault();
    }
  }
}
