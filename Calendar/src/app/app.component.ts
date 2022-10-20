import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ItemViewModel } from './calendar/calendar.component';
import { Item } from './data/app-data.model';
import { DataService } from './data/data.service';
import { StyleService } from './style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  dayTo: Date;
  dayFrom: Date;
  now: Date = new Date();

  constructor(private dataService: DataService, public style: StyleService) {
    const now = new Date();
    this.dayTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));   // Sunday
    this.dayFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 - now.getDay())); // Monday
  }

  current: ItemViewModel[] = [];

  ngOnInit(): void {
    timer(0, 60* 60 * 1000).pipe(
      mergeMap(() => this.dataService.load())
    ).subscribe(
      data => this.current = this.parse(data),
      error => console.error(error)
    );

    // update current time
    timer(0, 15000).subscribe(
      _ => this.now = new Date()
    );
  }

  private parse(input: Item[]): ItemViewModel[] {
    return input.map(i => {
      return <ItemViewModel>{
        begin: new Date(Date.parse(i.begin)),
        end: new Date(Date.parse(i.end)),
        name1: i.name1,
        name2: i.name2,
        info1: i.info1,
        info2: i.info2,
        info3: i.info3
      };
    }
    );
  }
}
