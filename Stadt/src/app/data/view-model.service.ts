import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewModelService {

  history: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.subscriptions.push(router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(event => {
      const start = <NavigationStart>event;
      if (start.navigationTrigger == "popstate")
        this.history.pop();
      else if (!router.getCurrentNavigation()?.extras?.replaceUrl)
        this.history.push(start.url);
    }));
  }

  ngOnDestroy(): void {
    for (var sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  reset() {
    this.router.navigate(["/"], { queryParamsHandling:"preserve" });
  }

  clear() {
    this.history = [];
  }
}
