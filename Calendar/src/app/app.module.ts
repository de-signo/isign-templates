import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CalendarComponent } from './calendar/calendar.component';
import { RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Register the locale data for German
registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: "**", component: AppComponent }
    ])
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
