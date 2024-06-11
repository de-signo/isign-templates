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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickThrottleConfig } from './click-throttle.service';
import { TouchClickDirective } from './touchclick.directive';


@NgModule({
  declarations: [
    TouchClickDirective
  ],
  exports: [
    TouchClickDirective
  ]
})
export class TemplateClickModule { 
  public static forRoot(options?: { throttleClicks: number }): ModuleWithProviders<TemplateClickModule> {
    return {
      ngModule: TemplateClickModule,
      providers: [
        { provide: ClickThrottleConfig, useValue: <ClickThrottleConfig>{ throttleClicks: options?.throttleClicks ?? 200 }}
      ],
    };
  }
}
