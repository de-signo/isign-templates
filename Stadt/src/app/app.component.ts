import { HostListener, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Subscription, timer } from 'rxjs';
import { Category } from './data/app-data.model';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

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
    this.subscriptions.push(timer(60 * 60 * 1000, 60* 60 * 1000).subscribe(_ => this.dataService.refresh()));
    this.subscriptions.push(this.dataService.categories.subscribe(cats => this.current = cats));
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  @HostListener("touchstart", ["$event"])
  touchHandler(event: any) {
    if(event.touches.length > 1) {
        // prevent mult touch
        event.preventDefault();
    }
  }
}
