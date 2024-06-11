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

import { EventEmitter, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StyleService {
 
  style: StyleFreeModel|StyleDbModel = new StyleFreeModel();
  updated = new EventEmitter();

  constructor() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const key = params.get("s") ?? "";
    switch (key) {
      default:
      case "std_door1_free":
        const stylef = new StyleFreeModel();
        stylef.header = params.get("s/header") ?? "";
        stylef.footer = params.get("s/footer") ?? "";
        stylef.style = <any>params.get("s/style") ?? "";
        stylef.names = [
          params.get("s/name1") ?? "",
          params.get("s/name2") ?? "",
          params.get("s/name3") ?? "",
          params.get("s/name4") ?? ""]
          .filter(item => item !== ""),
        this.style = stylef;
        break;
      case "std_door1_db":
        const styled = new StyleDbModel();
        styled.style = <any>params.get("s/style") ?? "";
        this.style = styled;
        break;
    }
  }
}

export interface StyleModel {
  key: "std_door1_free" | "std_door1_db";
  style: "t1"|"t2"|"t3"|"t4"|"t5";
}

export class StyleFreeModel implements StyleModel {
  key: "std_door1_free" = "std_door1_free";
  style: "t1"|"t2"|"t3"|"t4"|"t5" = "t1";
  header: string = ""
  footer: string = ""
  names: string[] = [];
}

export class StyleDbModel implements StyleModel {
  key: "std_door1_db" = "std_door1_db";
  style: "t1"|"t2"|"t3"|"t4"|"t5" = "t1";
}
