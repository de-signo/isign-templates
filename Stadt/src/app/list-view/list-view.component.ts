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

import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Item, TreeEntity, TreeReference } from '../data/app-data.model';
import { ConfigService } from '../data/config.service';
import { TreeOperations } from '../data/data.service';
import { ViewModelService } from '../data/view-model.service';
import { TemplateService } from '@isign/forms-templates';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnDestroy, AfterViewInit {
  enableAnchors = false;
  @Input() entity: TreeEntity|undefined;
  @Input() tree: (TreeEntity|TreeReference)[]|undefined;
  children: ItemViewModel[] = [];
  hooks: {[a: string]: boolean} = {};
  handicapped = false;
  defaultItemView: 'name'|'item-detail'|undefined;
  showBack = false;

  // scroll
  readonly handicappedScrollOffset: number = 500;
  scrollTop: number = this.handicappedScrollOffset;
  showScrollup = true;
  showScrolldown = true;
  @ViewChild("divScroll") divScroll!: ElementRef<HTMLElement>;

  subscriptions: Subscription[] = [];
  constructor(tmpl: TemplateService, private router: Router, config: ConfigService,
    private vm: ViewModelService, public scroller: ViewportScroller) {
    this.enableAnchors = !!tmpl.getTemplate().parameters["hooks"];
    this.subscriptions.push(config.settings.subscribe(
      settings => this.defaultItemView = settings?.list?.defaultItemView
    ));
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions)
      sub.unsubscribe();
    this.subscriptions = [];
  }

  ngOnInit(): void {
    if (this.entity?.children?.length == 1) {
      const child1 = this.entity.children[0];
      const target = TreeOperations.isTreeReference(child1) ? TreeOperations.findPath(this.tree, child1.referencePath) : child1;
      if (target) {
        this.router.navigate(['/'].concat(target.path ?? []), { replaceUrl: true });
        return
      }
    }
    this.buildItems(this.entity);
    this.showBack = this.vm.history.length > 1;
  }

  ngAfterViewInit() {
    // timer to start new change detection context
    timer(1).subscribe(_ => {
      this.scroll(0);
    });
  }

  scroll(dir: -1|0|1) {
    const el = this.divScroll.nativeElement;
    const max = el.scrollHeight - el.clientHeight;
    var st = this.scrollTop + dir * 500;
    const scrollTop = Math.max(0, Math.min(max, st));

    // cannot use binding / change detection for this, because it is updated by view
    el.scrollTop = scrollTop;
  }

  updateScrollTop() {
    // scolltop can change by external events and this.scrollTo
    // we use smooth scolling, this scrolltop can change frequently
    const el = this.divScroll.nativeElement;
    const max = el.scrollHeight - el.clientHeight;
    this.scrollTop = el.scrollTop;
    this.showScrollup = this.scrollTop != 0;
    this.showScrolldown = this.scrollTop != max;
  }

  showHandicapped(): void {
    this.handicapped = true;
    if (this.scrollTop == this.handicappedScrollOffset) {
      this.scrollTop = 0;
      this.scroll(0);
    }
  }

  buildItems(listItem: TreeEntity|undefined) {
    if (!listItem) {
      this.hooks = {};
      this.children = [];
      return;
    }
    const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']; 
    let hooks = abc.reduce((h, a) => ({...h, [a]: false}), {}) as {[id:string]:boolean};

    let last = "";
    this.children = listItem.children
      ?.map(child => TreeOperations.isTreeReference(child) ? TreeOperations.findPath(this.tree, child.referencePath) : child)
      ?.filter(i => i != undefined)
      ?.map(i => {
        const item = <TreeEntity>i;
        let ih = new ItemViewModel(item);
        let h = item.name?.[0]?.toUpperCase() ?? "";
        if (h != last) {
          last = h;
          ih.hook = h;
          if (hooks[h] == false)
            hooks[h] = true;
        }
        return ih;
      }) ?? [];
    this.hooks = hooks;
  }

  scrollTo(key: string) {
    document.getElementById('anchor' + key)?.scrollIntoView();
  }
}

class ItemViewModel implements TreeEntity {
  constructor(item: TreeEntity) {
    Object.assign(this, item);
  }
  id: string = "";
  listItemView: 'name' | 'item-detail' | undefined;
  parent: TreeEntity | undefined;
  name: string = "";
  children: TreeEntity[] | undefined;
  item!: Item;
  path: string[] | undefined;
  favorit: number | undefined;
  search: true | undefined;

  // view model
  hook: string|null = null;
}
