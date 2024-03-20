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
