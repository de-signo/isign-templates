import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CalendarComponent } from './calendar/calendar.component';
import { RouterModule } from '@angular/router';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "**", component: AppComponent}
    ])
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" }
  ]
})
export class AppModule { }
