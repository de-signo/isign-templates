import { Injectable } from '@angular/core';
import { DoorModel } from './app-data.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StyleService } from './style.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient, private style: StyleService)
  {}

  async load(): Promise<DoorModel> {
    const style = this.style.style;

    if (style.key == "std_door1_free") {
      return new Promise(resolve => resolve({
        header: style.header,
        footer: style.footer,
        names: style.names
      }));
    }
    else {
      const serviceUrl = environment.dataServiceUrl + window.location.search;
      return firstValueFrom(this.http.get<DoorModel>(serviceUrl))
    }
  }
}

type DataImportModel = {[key: string]: any}[];