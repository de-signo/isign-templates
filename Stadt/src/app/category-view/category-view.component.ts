import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent {
  enableSearch = false;

  constructor(public data: DataService, route: ActivatedRoute) {
    route.queryParams.subscribe(
      params => this.enableSearch = !!params["s/search"]);
   }
}
