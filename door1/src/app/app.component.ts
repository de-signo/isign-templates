import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { mergeMap, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  header: string = "";
  names: string[] = [];

  constructor(data: DataService) {
    timer(0, 300 * 1000).pipe(
      mergeMap(() => data.load())
    ).subscribe({
      next: data => {
        this.header = data.header;
        this.names = data.names;
      },
      error: error => console.error(error)
    });
  }
}
