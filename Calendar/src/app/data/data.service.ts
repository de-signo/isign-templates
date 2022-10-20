import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Item } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items: Item[] = [];

  constructor(private http: HttpClient)
  {}

  load(): Observable<Item[]>
  {
    const jsonFile = environment.dataServiceUrl;
    return this.http.get<Item[]>(jsonFile + window.location.search)
      .pipe(tap(data => {
        this.items = data;
      }));
  }

  getItems(): Observable<Item[]> {
    if (this.items.length == 0)
      return this.load();
    else
      return of(this.items);
  }
}
