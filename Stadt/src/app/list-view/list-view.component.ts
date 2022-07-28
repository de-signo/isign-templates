import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Item, TreeEntity, TreeReference } from '../data/app-data.model';
import { ConfigService } from '../data/config.service';
import { TreeOperations } from '../data/data.service';

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

  // scroll
  readonly handicappedScrollOffset: number = 500;
  scrollTop: number = this.handicappedScrollOffset;
  showScrollup = true;
  showScrolldown = true;
  @ViewChild("divScroll") divScroll!: ElementRef<HTMLElement>;

  subscriptions: Subscription[] = [];
  constructor(route: ActivatedRoute, config: ConfigService, public scroller: ViewportScroller) {
    this.subscriptions.push(route.queryParams.subscribe(
      params => this.enableAnchors = !!params["s/hooks"]));
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
        let h = item.name[0].toUpperCase();
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
