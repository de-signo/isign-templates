import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TreeEntity } from '../data/app-data.model';
import { DataService, TreeOperations } from '../data/data.service';

@Component({
  selector: 'app-select-view',
  templateUrl: './select-view.component.html',
})
export class SelectViewComponent implements OnDestroy{
  entity: TreeEntity|undefined;
  private path: string[] = [];
  tree: TreeEntity[] = [];

  private subscriptions: Subscription[] = [];

  constructor(route: ActivatedRoute, data: DataService) {
    this.subscriptions.push(route.params.subscribe(params => {
      this.path = params["path"].split("/").map((s:string)=>decodeURIComponent(s));
      this.update();
    }));
    this.subscriptions.push(data.tree.subscribe(tree => {
      this.tree = tree;
      this.update();
    }));
  }

  ngOnDestroy(): void {
    for (var sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  private update() {
    const entity = TreeOperations.findPath(this.tree, this.path);
    this.entity = entity;
  }
}
