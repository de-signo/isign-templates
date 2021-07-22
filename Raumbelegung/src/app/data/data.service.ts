import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Booking } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  static data: Booking;
  constructor(private http: HttpClient)
  {}

  load(): Observable<Booking>
  {
    const jsonFile = `${environment.dataServiceUrl}`;
    return this.http.get<Booking>(jsonFile);
  }
}
