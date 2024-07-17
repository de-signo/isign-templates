import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { CalendarComponent } from './calendar/calendar.component';
import { RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TemplateBaseRefModule, TemplateModule } from '@isign/forms-templates';
import { ISignPlayerExtensionsModule } from '@isign/player-extensions';
import { DataImportApiModule, ISignServicesModule } from '@isign/isign-services';
import { environment } from 'src/environments/environment';

// Register the locale data for German
registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    // enable hosting in forms show
    TemplateBaseRefModule.forRoot(),
    // parse the template query
    TemplateModule,
    // enable player extensions
    ISignPlayerExtensionsModule,
    // enable date import api client
    DataImportApiModule.forRoot(),
    // use isign service lookup and authentication
    ISignServicesModule.forRoot(environment.wellKnownISignUrl, "auto"),
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
