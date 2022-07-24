import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category, ItemWithIndex } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as fuzzysort from 'fuzzysort';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public categories: Category[] = [];
  private items: ItemWithIndex[] = [];

  constructor(private http: HttpClient)
  {}

  load(): Observable<Category[]>
  {
    const jsonFile = environment.dataServiceUrl;
    return this.http.get<Category[]>(jsonFile + window.location.search)
      .pipe(tap(data => {
        this.categories = data;
        this.items = [];
      }));
  }

  getCategories(): Observable<Category[]> {
    if (this.categories.length == 0)
      return this.load();
    else
      return of(this.categories);
  }

  getCategory(index: number): Observable<Category> {
    if (this.categories.length > index)
      return of(this.categories[index]);
    else
      return this.load().pipe(map(cats => cats[index]));
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
      this.getCategories().pipe(
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
