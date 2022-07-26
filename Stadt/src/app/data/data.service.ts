import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category, Item, ItemWithIndex } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as fuzzysort from 'fuzzysort';
import { ConfigService } from './config.service';
import { IAppConfig, IDataImportItemSource, IFileItemSource, IFixedItemSource } from './app-config.model';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private config: IAppConfig|null = null;

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories = this.categoriesSubject.asObservable();
  private items: ItemWithIndex[] = [];
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

    let cats: Category[] = [];
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
    this.categoriesSubject.next(cats);
  }

  private async loadFileSource(source: IFileItemSource, cats: Category[]): Promise<void> {
    const jsonFile = source.url;
    const data = await this.http.get<Category[]>(jsonFile + window.location.search).toPromise();
    this.mergeCategories(cats, data);
  }

  private async loadDataImportSource(source: IDataImportItemSource, cats: Category[]): Promise<void> {
    const serviceUrl = environment.dataImportServiceUrl;
    const items = await this.http.get<Item[]>(serviceUrl + window.location.search + `&ds=${source.dataSourceKey}`).toPromise();
    this.mergeCategories(cats, [{ name: source.category, items: items}]);
  }

  private loadFixedSource(source: IFixedItemSource, cats: Category[]) {
    this.mergeCategories(cats, [{ name: source.category, items: source.items}]);
  }

  private mergeCategories(cats: Category[], newCats: Category[]) {
    for (const nc of newCats)
    {
      let cat = cats.find(c => c.name == nc.name);
      if (cat) {
        cat.items = cat.items.concat(nc.items);
      } else {
        cat = { name: nc.name, items: nc.items};
        cats.push(cat);
      }
    }
  }

  getCategory(index: number): Observable<Category> {
    return this.categories.pipe(
      map(cats => cats[index]));
  }

  touch(id: string): Observable<boolean>
  {
    const jsonFile = environment.touchServiceUrl;
    if (jsonFile)
      return this.http.get<boolean>(jsonFile + window.location.search, { params: {id: id}});
    else
      return of(false);
  }

  getSearchResults(find: string, count: number): Observable<ItemWithIndex[]> {
    let dataObs = this.items.length != 0 ? of(this.items) : 
      this.categories.pipe(
        /* add item index */
        map(cats => cats
          .reduce((acc, cur, catIndex) => {
              let list = cur.items ? cur.items.map((c, itemIndex) => new ItemWithIndex(c, {cat: catIndex, item: itemIndex })) : [];
              return acc.concat(list);
            }, [] as ItemWithIndex[])
          .sort((a, b)=> (a.favorit ?? 0) - (b.favorit ?? 0))
        ));
    
    return dataObs.pipe(
      /* filter */
      map(items => {
        let res = fuzzysort.go(find, items, { limit: count, keys: ['term1', 'term2'] }).map(r => r.obj);
        let favC = count - res.length;
        let fav = favC > 0 ? items.splice(0, favC) : [];
        return res.concat(fav);
      })
    );
  }
}
