import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Category } from './data/app-data.model';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  constructor(private dataService: DataService, idle: Idle, router: Router) {
    idle.setIdle(20);
    idle.setTimeout(20);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      router.navigate(["/"], { queryParamsHandling:"preserve" });
      idle.watch();
    });
    idle.watch();
  }

  current: Category[] = [];

  ngOnInit(): void {
    timer(0, 60* 60 * 1000).pipe(
      mergeMap(() => this.dataService.load())
    ).subscribe(
      data => this.current = data,
      error => console.error(error)
    );
  }
}
