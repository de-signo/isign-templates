import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAppConfig } from './app-config.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private settingsSubject: BehaviorSubject<IAppConfig|null> = new BehaviorSubject<IAppConfig|null>(null);
  settings: Observable<IAppConfig|null> = this.settingsSubject.asObservable();
  constructor(private http: HttpClient) {}

  async load() : Promise<void> {
    const jsonFile = `${environment.config}`;
    const response = await this.http.get<IAppConfig>(jsonFile).toPromise();
    this.settingsSubject.next(response);
  }
}
