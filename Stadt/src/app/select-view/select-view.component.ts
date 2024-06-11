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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeEntity } from '../data/app-data.model';
import { DataService, TreeOperations } from '../data/data.service';

@Component({
  selector: 'app-select-view',
  templateUrl: './select-view.component.html',
})
export class SelectViewComponent implements OnDestroy{
  entity: TreeEntity|undefined;
  private path: string[] = [];
  tree: TreeEntity[] = [];

  private subscriptions: Subscription[] = [];

  constructor(route: ActivatedRoute, data: DataService) {
    this.subscriptions.push(route.params.subscribe(params => {
      this.path = params["path"].split("/").map((s:string)=>decodeURIComponent(s));
      this.update();
    }));
    this.subscriptions.push(data.tree.subscribe(tree => {
      this.tree = tree;
      this.update();
    }));
  }

  ngOnDestroy(): void {
    for (var sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  private update() {
    const entity = TreeOperations.findPath(this.tree, this.path);
    this.entity = entity;
  }
}
