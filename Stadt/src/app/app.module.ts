import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { NgIdleModule } from '@ng-idle/core';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CategoryViewComponent,
    ListViewComponent,
    DetailViewComponent,
    SearchViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "index.cshtml", component: CategoryViewComponent},
      {path: "search", component: SearchViewComponent},
      {path: ":cat/:item", component: DetailViewComponent},
      {path: ":cat", component: ListViewComponent},
      {path: "**", component: CategoryViewComponent}
    ]),
    NgIdleModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" }
  ]
})
export class AppModule { }
