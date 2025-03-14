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

import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ThinTreeEntity, TreeEntity, TreeReference } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable, of, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as fuzzysort from 'fuzzysort';
import { ConfigService } from './config.service';
import { IAppConfig, IDataImportItemSource, IFileItemSource, IFixedItemSource } from './app-config.model';
import { DataImportService } from '@isign/isign-services';
import { TemplateService } from '@isign/forms-templates';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private config: IAppConfig|undefined = undefined;

  private treeSubject = new BehaviorSubject<TreeEntity[]>([]);
  public tree = this.treeSubject.asObservable();
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient,
    private configSvc: ConfigService,
    private readonly dataImportSvc: DataImportService,
    private readonly templateSvc: TemplateService)
  {
    this.subscriptions.push(this.configSvc.settings.subscribe(config => {
      this.config = config
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
    if (data == undefined || environment.checkData && !TreeOperations.isTreeValid(data))
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
    const template = this.templateSvc.getTemplate();
    if (!template)
      throw new Error("Template not loaded");
    const dsId = template.parameters[source.dataSourceKey];
    if (!dsId)
      throw new Error(`Datasource ID is missing for field ${source.dataSourceKey}`);
    const dataImportObs = this.dataImportSvc.getDataTable(dsId);

    const fieldPrefix = source.fieldPrefix ?? "";

    let newTree: (ThinTreeEntity|TreeReference)[];
    switch (source.mapTo) {
      case 'group-with-reference-id':
        // items: { name: string, referenceId: string }
        const itemsObs = dataImportObs.pipe(
          map(items => template.bindDataTable(items, {
            name: { field: fieldPrefix + "name", default: "" },
            referenceId: { field: fieldPrefix + "referenceId", default: "" },
          })),
          map(items =>
            Object.entries(DataService.groupBy(items.filter(i => !!i.name && !!i.referenceId), i => i.name))
            .map(grp => (<ThinTreeEntity>{
              name: grp[0], item: undefined,
              children: grp[1]
                .map(i => DataService.findEntityWhereItemHasId(cats, i.referenceId))
                .filter(e => !!e), 
              favorit: undefined, search: source.search, listItemView: source.listItemView})))
        );
        newTree = [{ id: source.category, name: source.category, children: await lastValueFrom(itemsObs), item: undefined, favorit: undefined, search: undefined, listItemView: undefined}]
        break;
      case 'categories-with-items':
        // this is the classic import equivalent
        // items: Item[]
        const itemsObs1 = dataImportObs.pipe(
          map(items => template.bindDataTable(items, {
            category: { field: fieldPrefix + "cat", default: "" },
            id: { field: fieldPrefix + "id", default: "" },
            term1: { field: fieldPrefix + "term1", default: "" },
            term2: { field: fieldPrefix + "term2", default: "" },
            house: { field: fieldPrefix + "house", default: "" },
            level: { field: fieldPrefix + "level", default: "" },
            room: { field: fieldPrefix + "room", default: "" },
            info: { field: fieldPrefix + "info", default: "" },
            phone: { field: fieldPrefix + "phone", default: "" },
            email: { field: fieldPrefix + "email", default: "" },
            map: { field: fieldPrefix + "map", default: "" }
          })),
        map(items =>
          Object.entries(DataService.groupBy(items.filter(i => !!i.category), i => i.category))
          .map(catGrp => ({
            // category
            id: catGrp[0], name: catGrp[0], item: undefined, favorit: undefined, search: undefined, listItemView: undefined,
            children: catGrp[1].map(
              // items              
              it => ({id: it.id ?? it.term1, name: it.term1, item: it, children: [], favorit: undefined, search: source.search, listItemView: source.listItemView}))
          }))
        ));
        newTree = await lastValueFrom(itemsObs1);
        break;
      case 'leaf-item':
      default:
        // items: Item[]
        const itemsObs2 = dataImportObs.pipe(
          map(items => template.bindDataTable(items, {
            id: { field: fieldPrefix + "id", default: "" },
            term1: { field: fieldPrefix + "term1", default: "" },
            term2: { field: fieldPrefix + "term2", default: "" },
            house: { field: fieldPrefix + "house", default: "" },
            level: { field: fieldPrefix + "level", default: "" },
            room: { field: fieldPrefix + "room", default: "" },
            info: { field: fieldPrefix + "info", default: "" },
            phone: { field: fieldPrefix + "phone", default: "" },
            email: { field: fieldPrefix + "email", default: "" },
            map: { field: fieldPrefix + "map", default: "" }
          })),
        map(items => 
          items.map(it => ({id: it.id ?? it.term1, name: it.term1, item: it, children: [], favorit: undefined, search: source.search, listItemView: source.listItemView}))
        ));
        newTree = [{ id: source.category, name: source.category, children: await lastValueFrom(itemsObs2), item: undefined, favorit: undefined, search: undefined, listItemView: undefined}]
        break;
    }
    TreeOperations.mergeTree(cats, newTree);
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
              this.mergeTree(entity.children, nt.children, entity, [...path, entity.name ?? ""]);
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
          fatNt.id ??= fatNt.name ?? ""; // id must be set!
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
      te.id ??= te.name ?? ""; // id must be set!
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