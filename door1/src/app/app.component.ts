import { Component, HostBinding } from '@angular/core';
import { DataService } from './services/data.service';
import { mergeMap, timer } from 'rxjs';
import { StyleService } from './services/style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  header: string = "";
  footer: string = "";
  names: string[] = [];

  @HostBinding('class.style-t1') enableStyleT1: boolean = false;
  @HostBinding('class.style-t2') enableStyleT2: boolean = false;
  @HostBinding('class.style-t3') enableStyleT3: boolean = false;
  @HostBinding('class.style-t4') enableStyleT4: boolean = false;
  @HostBinding('class.style-t5') enableStyleT5: boolean = false;

  constructor(data: DataService, style: StyleService) {
    switch (style.style.style) {
      case "t1":
        this.enableStyleT1 = true;
        break;
      case "t2":
        this.enableStyleT2 = true;
        break;
      case "t3":
        this.enableStyleT3 = true;
        break;
      case "t4":
        this.enableStyleT4 = true;
        break;
      case "t5":
        this.enableStyleT5 = true;
        break;
    }

    timer(0, 300 * 1000).pipe(
      mergeMap(() => data.load())
    ).subscribe({
      next: data => {
        this.header = data.header;
        this.footer = data.footer;
        this.names = data.names;
      },
      error: error => console.error(error)
    });
  }
}
