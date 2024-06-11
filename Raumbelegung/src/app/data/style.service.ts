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
import { Booking, BookingViewModel } from "./app-data.model";

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
      case "raumbelegung2021_free":
        const stylef = new StyleFreeModel();
        stylef.title = params.get("s/title") ?? "";
        stylef.subtitle = params.get("s/subtitle") ?? "";
        stylef.participants = (params.get("s/participants") ?? "").split(",");
        stylef.date = params.get("s/date") ?? "";
        stylef.from = params.get("s/from") ?? "";
        stylef.to = params.get("s/to") ?? "";
        this.style = stylef;
        break;
      case "raumbelegung2021A":
      case "raumbelegung2021B":
        const styled = new StyleDbModel();
        styled.key = key;
        this.style = styled;
        break;
    }
  }
}

export interface StyleModel {
  key: "raumbelegung2021_free" | "raumbelegung2021A" | "raumbelegung2021B";
}

export class StyleFreeModel implements StyleModel, BookingViewModel {
  key: "raumbelegung2021_free" = "raumbelegung2021_free";
  title: string = ""
  subtitle: string = ""
  participants: string[] = []
  date: string = ""
  from: string = ""
  to: string = ""
}

export class StyleDbModel implements StyleModel {
  key: "raumbelegung2021A" | "raumbelegung2021B" = "raumbelegung2021A";
}
