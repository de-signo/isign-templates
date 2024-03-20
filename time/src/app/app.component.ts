import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  now: Date = new Date();
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(interval(10000).
    subscribe(_ => this.update()));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

  private update() {
    this.now = new Date();
  }
}
