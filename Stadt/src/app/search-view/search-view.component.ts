import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeEntity } from '../data/app-data.model';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit, OnDestroy {
  keyboard: Key[][] = [];
  @ViewChild("txtFind") txtFind!: ElementRef;

  results: TreeEntity[] = [];
  private subscriptions: Subscription[] = [];

  constructor(route: ActivatedRoute, private svc: DataService) {
    this.subscriptions.push(route.queryParams.subscribe(params =>
      {
        let type = params["s/search"];
        this.loadKeyboard(type);
      }));
  }

  ngOnInit(): void {
    this.updateFind();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
  loadKeyboard(type: string) {
    switch(type.toLowerCase()) {
      case "q":
      case "qwertz":
      default:
        this.keyboard = [
          [..."1234567890"].map(k => new Key(k)),
          [..."QWERTZUIOPÜ"].map(k => new Key(k)),
          [..."ASDFGHJKLÖÄ"].map(k => new Key(k)),
          [..."YXCVBNM"].map(k => new Key(k)),
          [new Key("-"), {key:" ", display:"&nbsp;", class:"space"}, {key:String.fromCharCode(8), display:"Entf", class:"Taste_Entf"}]
        ];
        break;
      case "a":
      case "abc":
        this.keyboard = [
          [..."1234567890"].map(k => new Key(k)),
          [..."ABCDEFGHIJK"].map(k => new Key(k)),
          [..."LMNOPQRSTUV"].map(k => new Key(k)),
          [..."WXYZÄÖÜ"].map(k => new Key(k)),
          [new Key("-"), {key:" ", display:"&nbsp;", class:"space"}, {key:String.fromCharCode(8), display:"Entf", class:"Taste_Entf"}]
        ];
        break;
    }
  }

  keyPress(key: Key) {
    if (key.key == String.fromCharCode(8)) {
      let value = this.txtFind.nativeElement.value;
      this.txtFind.nativeElement.value = value.slice(0, -1);
    }
    else
      this.txtFind.nativeElement.value += key.key;
    this.updateFind();
  }

  updateFind() {
    const find = this.txtFind?.nativeElement?.value ?? "";
    this.svc.getSearchResults(find, 6).subscribe(
      data => this.results = data,
      error => console.error(error)
    )
  }
}

class Key {
  constructor(k: string) {
    this.key = k;
    this.display = k;
  }
  key: string = "";
  display: string = "";
  class: string = "";
}
