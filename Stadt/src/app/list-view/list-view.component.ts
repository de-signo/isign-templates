import { ViewportScroller } from '@angular/common';
import { Component, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Item } from '../data/app-data.model';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  enableAnchors = false;
  category: Category = new Category();
  items: ItemWithHook[] = [];
  hooks: {[a: string]: boolean} = {};
  handicapped = false;

  constructor(svc: DataService, route: ActivatedRoute, public scroller: ViewportScroller) {
    route.queryParams.subscribe(
      params => this.enableAnchors = !!params["s/hooks"]);
    route.params.subscribe(
      data => {
        const categoryId = data["cat"];
        svc.getCategory(categoryId).subscribe(
          data => { this.category = data; this.buildItems(this.category.items); },
          error => console.error(error)
        );
      }
    );
  }

  buildItems(items: Item[]) {
    if (!items) {
      this.hooks = {};
      this.items = [];
      return;
    }
    const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']; 
    let hooks = abc.reduce((h, a) => ({...h, [a]: false}), {}) as {[id:string]:boolean};

    let last = "";
    this.items = items.map(i => {
      let ih = new ItemWithHook(i);
      let h = i.term1[0].toUpperCase();
      if (h != last) {
        last = h;
        ih.hook = h;
        hooks[h] = true;
      }
      return ih;
    });
    this.hooks = hooks;
  }

  scrollTo(key: string) {
    document.getElementById('anchor' + key)?.scrollIntoView();
  }
}

class ItemWithHook extends Item {
  constructor(item: Item) {
    super();
    Object.assign(this, item);
  }
  hook: string|null = null;
}
