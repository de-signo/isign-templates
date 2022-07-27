import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, Route, RouteReuseStrategy, RouterModule, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { NgIdleModule } from '@ng-idle/core';
import { ConfigService } from './data/config.service';
import { SelectViewComponent } from './select-view/select-view.component';

registerLocaleData(localeDe);

export function initializeApp(appConfig: ConfigService) {
  return () => appConfig.load();
}

function pathMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route) : UrlMatchResult|null {
  // match any route but empty
  if (segments.length > 0) {
    return {
      consumed: segments,
      posParams: {
        path: new UrlSegment(segments.join("/"), {})
      }
    };
  }
  return null;
}

class CustomReuseStrategy extends BaseRouteReuseStrategy {
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // when navigating form list-view to list-view, don not reuse it!
    return false;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    CategoryViewComponent,
    ListViewComponent,
    DetailViewComponent,
    SearchViewComponent,
    SelectViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "", component: CategoryViewComponent},
      {path: "index.cshtml", component: CategoryViewComponent},
      {path: "search", component: SearchViewComponent},
      {matcher: pathMatcher, component: SelectViewComponent}
    ]),
    NgIdleModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    ConfigService,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService], multi: true },
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ]
})
export class AppModule { }
