import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ThinTreeEntity, TreeEntity, TreeReference } from './app-data.model';
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

    this.treeSubject.next(cats);
  }

  private async loadFileSource(source: IFileItemSource, cats: TreeEntity[]): Promise<void> {
    const jsonFile = source.url;
    const data = await this.http.get<TreeEntity[]>(jsonFile + window.location.search).toPromise();
    if (environment.checkData && !TreeOperations.isTreeValid(data))
      throw `File source from '${jsonFile}' did not return a valid tree`;
    TreeOperations.mergeTree(cats, data);
  }
  
  private static groupBy<T>(array: T[], predicate: (v: T) => string) : {[key: string]: T[]} {
    // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
    return array.reduce((acc, value) => {
      (acc[predicate(value)] ||= []).push(value);
      return acc;
    }, {} as { [key: string]: T[] });
  }

  private static findEntityWhereItemHasId(tree: (TreeEntity|TreeReference)[], referenceId: string): TreeReference|undefined {
    let result: TreeReference|undefined;
    TreeOperations.walkTree<boolean>(tree, (te, state) => {
      if (!state && te?.id == referenceId) {
        result = { referencePath: te.path! }
        return true;
      }
      return false;
    } , false);
    return result;
  }

  private async loadDataImportSource(source: IDataImportItemSource, cats: TreeEntity[]): Promise<void> {
    const serviceUrl = environment.dataImportServiceUrl;
    const items = await this.http.get<any[]>(serviceUrl + window.location.search + `&ds=${source.dataSourceKey}`).toPromise();

    let children: (ThinTreeEntity|TreeReference)[];
    switch (source.mapTo) {
      case 'group-with-reference-id':
        // items: { name: string, referenceId: string }
        children = Object.entries(DataService.groupBy(items.filter(i => !!i.name && !!i.referenceId), i => i.name))
          .map(grp => (<ThinTreeEntity>{name: grp[0], item: undefined, children: grp[1].map(i => DataService.findEntityWhereItemHasId(cats, i.referenceId)).filter(e => !!e), favorit: undefined, search: source.search, listItemView: source.listItemView}));
        break;
      case 'leaf-item':
      default:
        // items: Item[]
        children = items.map(it => ({id: it.id ?? it.term1, name: it.term1, item: it, children: [], favorit: undefined, search: source.search, listItemView: source.listItemView}));
        break;
    }
    TreeOperations.mergeTree(cats, [{ id: source.category, name: source.category, children: children, item: undefined, favorit: undefined, search: undefined, listItemView: undefined}]);
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
    const fillUpResults = this.config?.search?.fillUpResults ?? true;
    const showFavorits = this.config?.search?.showFavorits ?? true;

    return this.searchSource.pipe(
      /* filter */
      map(items => {
        if (!find) {
          return showFavorits ? items.slice(0, count) : [];
        }
        else {
          let res = fuzzysort.go(find, items, { limit: count, keys: ['name'] }).map(r => r.obj);
          if (!fillUpResults)
            return res;
          let favC = count - res.length;
          let fav = favC > 0 ? items.slice(0, favC) : [];
          return res.concat(fav);
        }
      })
    );  
  }
}

export class TreeOperations {
  static isTreeReference(tree: ThinTreeEntity|TreeReference): tree is TreeReference {
    return "referencePath" in tree;
  }

  static mergeTree(tree: (TreeEntity|TreeReference)[], newTree: (ThinTreeEntity|TreeReference)[], parent: TreeEntity|undefined=undefined, path: string[]=[]) {
    for (const nt of newTree)
    {
      if (this.isTreeReference(nt)) {
        let ref = <TreeReference>tree.find(c => this.isTreeReference(c) && this.pathEqual(c.referencePath, nt.referencePath));
        if (!ref)
          tree.push(ref);
      }
      else {
        let entity = <TreeEntity>tree.find(c => !this.isTreeReference(c) && c.name == nt.name);
        if (entity) {
          if (nt.children)
          {
            if (entity.children)
              this.mergeTree(entity.children, nt.children, entity, [...path, entity.name]);
            else
              entity.children = this.makeChildrenFat(nt.children, entity);
          }
          if (!entity.item)
            entity.item = nt.item;
          else
            Object.assign(entity.item, nt.item);
        } else {
          // set path and parent (complete subtree)
          const fatNt = <TreeEntity>nt;
          fatNt.id ??= fatNt.name; // id must be set!
          fatNt.parent = parent;
          fatNt.path = [...path, this.normalizePathComponent(fatNt.id)];
          if (fatNt.children) {
            this.makeChildrenFat(fatNt.children, fatNt);
          }
          tree.push(fatNt);
        }
      }
    }
  }

  private static normalizePathComponent(id: string|number): string {
    if (typeof(id) == 'number')
      return id.toString();
    return id.replace(/\//, "-");
  }

  private static makeChildrenFat(thinTree: (ThinTreeEntity|TreeReference)[], parent: TreeEntity): (TreeEntity|TreeReference)[] {
    const tree = <(TreeEntity|TreeReference)[]>thinTree;
    TreeOperations.walkTree(tree, (te, parent) => {
      if (!parent.path)
        throw "Algoritm error";
      te.id ??= te.name; // id must be set!
      te.parent = parent;
      te.path = [...parent.path, this.normalizePathComponent(te.id)];
      return te;
    }, parent);
    return tree;
  }

  static walkTree<T>(tree: (TreeEntity|TreeReference)[], action: (te: TreeEntity, state: T)=>T, state: T) {
    for (const te of tree) {
      if (this.isTreeReference(te)) continue;
      const newState = action(te, state);
      if (te.children)
        this.walkTree(te.children, action, newState);
    }
  }

  static findPath(tree: (TreeEntity|TreeReference)[]|undefined, path: string|string[]) : TreeEntity|undefined {
    if (typeof path === 'string')
      path = path.split("/");

    let te: TreeEntity|undefined = undefined;
    for (const component of path) {
      if (!tree)
        return undefined;

      te = <TreeEntity>tree.find(te => !this.isTreeReference(te) && this.normalizePathComponent(te.id) == component);
      tree = te?.children;
    }
    return te;
  }

  static pathEqual(p1: string|string[], p2: string|string[]): boolean {
    if (typeof p1 == typeof p2)
      return p1 == p2;
    else {
      const sp1 = typeof p1 == 'string' ? p1 : p1.join("/");
      const sp2 = typeof p2 == 'string' ? p2 : p2.join("/");
      return sp1 == sp2;
    }
  }
  static isTreeValid(tree: TreeEntity[]): boolean {
    return Array.isArray(tree);
  }
}