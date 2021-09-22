import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Booking } from './data/app-data.model';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  constructor(private dataService: DataService) {}

  current: Booking | null = null;

  ngOnInit(): void {
    timer(0, 10 * 1000).pipe(
      mergeMap(() => this.dataService.load())
    ).subscribe(
      data => this.current = data,
      error => console.error(error)
    );
  }
}
