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

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TreeEntity } from '../data/app-data.model';
import { DataService } from '../data/data.service';
import { TemplateService } from '@isign/forms-templates';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit, OnDestroy {
  keyboard: Key[][] = [];
  @ViewChild("txtFind") txtFind!: ElementRef;

  results: TreeEntity[] = [];
  private subscriptions: Subscription[] = [];

  constructor(tmpl: TemplateService, private svc: DataService) {
    let type = tmpl.getTemplate().parameters["search"] ?? "";
    this.loadKeyboard(type);
  }

  ngOnInit(): void {
    this.updateFind();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
  loadKeyboard(type: string) {
    switch(type.toLowerCase()) {
      case "q":
      case "qwertz":
      default:
        this.keyboard = [
          [..."1234567890"].map(k => new Key(k)),
          [..."QWERTZUIOPÜ"].map(k => new Key(k)),
          [..."ASDFGHJKLÖÄ"].map(k => new Key(k)),
          [..."YXCVBNM"].map(k => new Key(k)),
          [new Key("-"), {key:" ", display:"&nbsp;", class:"space"}, {key:String.fromCharCode(8), display:"Entf", class:"Taste_Entf"}]
        ];
        break;
      case "a":
      case "abc":
        this.keyboard = [
          [..."1234567890"].map(k => new Key(k)),
          [..."ABCDEFGHIJK"].map(k => new Key(k)),
          [..."LMNOPQRSTUV"].map(k => new Key(k)),
          [..."WXYZÄÖÜ"].map(k => new Key(k)),
          [new Key("-"), {key:" ", display:"&nbsp;", class:"space"}, {key:String.fromCharCode(8), display:"Entf", class:"Taste_Entf"}]
        ];
        break;
    }
  }

  keyPress(key: Key) {
    if (key.key == String.fromCharCode(8)) {
      let value = this.txtFind.nativeElement.value;
      this.txtFind.nativeElement.value = value.slice(0, -1);
    }
    else
      this.txtFind.nativeElement.value += key.key;
    this.updateFind();
  }

  updateFind() {
    const find = this.txtFind?.nativeElement?.value ?? "";
    this.svc.getSearchResults(find, 6).subscribe(
      data => this.results = data,
      error => console.error(error)
    )
  }
}

class Key {
  constructor(k: string) {
    this.key = k;
    this.display = k;
  }
  key: string = "";
  display: string = "";
  class: string = "";
}
