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

import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TemplateBaseRefModule, TemplateModule } from "@isign/forms-templates";
import { QRCodeModule } from 'angularx-qrcode';
import { DataImportApiModule, ServiceInfoInterceptor, ISignServicesModule } from "@isign/isign-services";
import localeDe from '@angular/common/locales/de';
import { environment } from 'src/environments/environment';
import { ISignPlayerExtensionsModule } from "@isign/player-extensions";

registerLocaleData(localeDe);


@NgModule({
  declarations: [
    AppComponent
  ],
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
    QRCodeModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    provideHttpClient(withInterceptorsFromDi()),
    ...
    // debug data
    environment.production || environment.wellKnownISignUrl ? [] : 
    [
      // use demo data
      { provide: HTTP_INTERCEPTORS, useValue: new ServiceInfoInterceptor({services: [ { name: "DataImportApi", url: "assets/dataimport"}]}), multi: true},
    ]
  ]
})
export class AppModule { }
