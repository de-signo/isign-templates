import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StyleService {
  header: string = "";

  constructor(route: ActivatedRoute) {
    route.queryParams.subscribe((params) => {
      this.header = params["s/header"] ?? "";
    });
  }
}
