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

import { Injectable } from "@angular/core";
import { TemplateInstance, TemplateService } from '@isign/forms-templates';

@Injectable({
  providedIn: "root",
})
export class StyleService {

  style: StyleModel;
  template: TemplateInstance;

  constructor(ts: TemplateService) {
    const tmpl = this.template = ts.getTemplate();

    this.style = {
      header: tmpl.parameters["header"] ?? "1",
      days: tmpl.parameters["days"] ?? "1",
      hourFrom: parseInt(tmpl.parameters["startt"] ?? "0"),
      hourTo: parseInt(tmpl.parameters["endt"] ?? "0"),
      dataSourceID: tmpl.parameters["source"],
    };
  }
}

export interface StyleModel {
  header: string;
  hourFrom: number;
  hourTo: number; // inklusive
  days: string;
  dataSourceID?: string;
}
