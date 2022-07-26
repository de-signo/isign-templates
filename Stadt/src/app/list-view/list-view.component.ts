import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { Item, TreeEntity } from '../data/app-data.model';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, AfterViewInit {
  enableAnchors = false;
  @Input() entity: TreeEntity|undefined;
  items: ItemViewModel[] = [];
  hooks: {[a: string]: boolean} = {};
  handicapped = false;

  // scroll
  readonly handicappedScrollOffset: number = 500;
  scrollTop: number = this.handicappedScrollOffset;
  showScrollup = true;
  showScrolldown = true;
  @ViewChild("divScroll") divScroll!: ElementRef<HTMLElement>;

  constructor(route: ActivatedRoute, public scroller: ViewportScroller) {
    route.queryParams.subscribe(
      params => this.enableAnchors = !!params["s/hooks"]);
  }

  ngOnInit(): void {
    this.buildItems(this.entity);
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
    this.scrollTop = Math.max(0, Math.min(max, st));
    this.showScrollup = this.scrollTop != 0;
    this.showScrolldown = this.scrollTop != max;

    // cannot use binding / change detection for this, because it is updated by view
    el.scrollTop = this.scrollTop;
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
      this.items = [];
      return;
    }
    const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']; 
    let hooks = abc.reduce((h, a) => ({...h, [a]: false}), {}) as {[id:string]:boolean};

    let last = "";
    this.items = listItem.children?.map(i => {
      let ih = new ItemViewModel(i);
      let h = i.name[0].toUpperCase();
      if (h != last) {
        last = h;
        ih.hook = h;
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
  parent: TreeEntity | undefined;
  name: string = "";
  children: TreeEntity[] | undefined;
  item!: Item;
  path: string[] | undefined;
  favorit: number | undefined;
  search: true | undefined;
  hook: string|null = null;
}
