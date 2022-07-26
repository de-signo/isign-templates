import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TreeEntity, Item } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as fuzzysort from 'fuzzysort';
import { ConfigService } from './config.service';
import { IAppConfig, IDataImportItemSource, IFileItemSource, IFixedItemSource } from './app-config.model';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private config: IAppConfig|null = null;

  private treeSubject = new BehaviorSubject<TreeEntity[]>([]);
  public tree = this.treeSubject.asObservable();
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private configSvc: ConfigService)
  {
    this.subscriptions.push(this.configSvc.settings.subscribe(config => {
      this.config = config;
      return this.refresh();
    }));
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  public async refresh(): Promise<void> {
    const config = this.config;
    if (!config) return;

    let cats: TreeEntity[] = [];
    for (const src of config.sources) {
      switch (src.type) {
        case "file":
          await this.loadFileSource(src, cats);
          break;
        case "dataimport":
          await this.loadDataImportSource(src, cats);
          break;
        case "fixed":
          this.loadFixedSource(src, cats);
          break;
        default:
          console.error(`Source type '${(<any>src).type}' is not supported`);
          break;
      }
    }

    // set path and parent
    TreeOperations.walkTree(cats, (te, state) => {
      const path = [...state.path, te.name];
      te.parent = state.parent;
      te.path = path;
      return {parent: te, path: path};
    }, {parent: <TreeEntity|undefined>undefined, path: <string[]>[]});
    this.treeSubject.next(cats);
  }

  private async loadFileSource(source: IFileItemSource, cats: TreeEntity[]): Promise<void> {
    const jsonFile = source.url;
    const data = await this.http.get<TreeEntity[]>(jsonFile + window.location.search).toPromise();
    if (environment.checkData && !TreeOperations.isTreeValid(data))
      throw `File source from '${jsonFile}' did not return a valid tree`;
    TreeOperations.mergeTree(cats, data);
  }

  private async loadDataImportSource(source: IDataImportItemSource, cats: TreeEntity[]): Promise<void> {
    const serviceUrl = environment.dataImportServiceUrl;
    const items = await this.http.get<Item[]>(serviceUrl + window.location.search + `&ds=${source.dataSourceKey}`).toPromise();
    const tree = items.map(it => ({name: it.term1, item: it, children: [], parent: undefined, path: undefined, favorit: undefined, search: source.search}));
    TreeOperations.mergeTree(cats, [{ name: source.category, children: tree, item: undefined, parent: undefined, path: undefined, favorit: undefined, search: undefined}]);
  }

  private loadFixedSource(source: IFixedItemSource, cats: TreeEntity[]) {
    if (environment.checkData && !TreeOperations.isTreeValid(source.tree))
      throw `Fixed source does not contain a valid tree`;
    TreeOperations.mergeTree(cats, source.tree);
  }

  getEntity(path: string[]): Observable<TreeEntity|undefined> {
    return this.tree.pipe(
      map(tree => TreeOperations.findPath(tree, path))
    );
  }

  touch(entity: TreeEntity): Observable<boolean>
  {
    if (!entity.path) return of (false);
    var id = entity.path.join("/");
    const jsonFile = environment.touchServiceUrl;
    if (jsonFile)
      return this.http.get<boolean>(jsonFile + window.location.search, { params: {id: id}});
    else
      return of(false);
  }

  private readonly searchSource = this.tree.pipe(
    /* flatten */
    map(tree => {
      let list: TreeEntity[] = [];
      TreeOperations.walkTree<void>(tree, (te, _) => { if (te.search) { list.push(te); }}, undefined);
      return list;
    }),
    /* sort by favorit score */
    map(list => list
      .sort((a, b)=> (a.favorit ?? 0) - (b.favorit ?? 0))
    ),
    shareReplay()
  );

  getSearchResults(find: string, count: number): Observable<TreeEntity[]> {
    return this.searchSource.pipe(
      /* filter */
      map(items => {
        let res = fuzzysort.go(find, items, { limit: count, keys: ['name'] }).map(r => r.obj);
        let favC = count - res.length;
        let fav = favC > 0 ? items.slice(0, favC) : [];
        return res.concat(fav);
      })
    );  
  }
}

export class TreeOperations {
  static mergeTree(tree: TreeEntity[], newTree: TreeEntity[]) {
    for (const nt of newTree)
    {
      let entity = tree.find(c => c.name == nt.name);
      if (entity) {
        if (nt.children)
        {
          if (entity.children)
            this.mergeTree(entity.children, nt.children);
          else
            entity.children = nt.children;
        }
        if (!entity.item)
          entity.item = nt.item;
        else
          Object.assign(entity.item, nt.item);
      } else {
        tree.push(nt);
      }
    }
  }

  static walkTree<T>(tree: TreeEntity[], action: (te: TreeEntity, state: T)=>T, state: T) {
    for (const te of tree) {
      const newState = action(te, state);
      if (te.children)
        this.walkTree(te.children, action, newState);
    }
  }

  static findPath(tree: TreeEntity[]|undefined, path: string|string[]) : TreeEntity|undefined {
    if (typeof path === 'string')
      path = path.split("/");

    let te: TreeEntity|undefined = undefined;
    for (const name of path) {
      if (!tree)
        return undefined;

      te = tree.find(te => te.name == name);
      tree = te?.children;
    }
    return te;
  }

  static isTreeValid(tree: TreeEntity[]): boolean {
    return Array.isArray(tree);
  }
}