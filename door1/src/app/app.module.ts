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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TemplateBaseRefModule, TemplateModule } from '@isign/forms-templates';
import { ISignPlayerExtensionsModule } from '@isign/player-extensions';
import { DataImportApiModule, ISignServicesModule } from '@isign/isign-services';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
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
    
    BrowserModule],
  providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
