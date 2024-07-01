/* 
 *  Copyright (C) 2024 DE SIGNO GmbH
 *  
 *  This program is dual licensed. If you did not license the program under
 *  different terms, the following applies:
 *  
 *  This program is free software: You can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *  
 */

import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, Route, RouteReuseStrategy, RouterModule, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { NgIdleModule } from '@ng-idle/core';
import { ConfigService } from './data/config.service';
import { SelectViewComponent } from './select-view/select-view.component';
import { HomeIconDirective } from './directives/home-icon.directive';
import { BackIconDirective } from './directives/back-icon.directive';
import { DownIconDirective } from './directives/down-icon.directive';
import { UpIconDirective } from './directives/up-icon.directive';
import { TemplateClickModule, TouchClickDirective } from 'isign-templates';
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

@NgModule({ declarations: [
        AppComponent,
        CategoryViewComponent,
        ListViewComponent,
        DetailViewComponent,
        SearchViewComponent,
        SelectViewComponent,
        BackIconDirective,
        DownIconDirective,
        HomeIconDirective,
        UpIconDirective
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        RouterModule.forRoot([
            { path: "", component: CategoryViewComponent },
            { path: "index.cshtml", component: CategoryViewComponent },
            { path: "search", component: SearchViewComponent },
            { matcher: pathMatcher, component: SelectViewComponent }
        ]),
        NgIdleModule.forRoot(),
        TemplateClickModule.forRoot()], providers: [
        { provide: LOCALE_ID, useValue: "de-DE" },
        ConfigService,
        { provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService], multi: true },
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
