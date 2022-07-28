import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data/data.service';
import { ViewModelService } from '../data/view-model.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {
  enableSearch = false;

  constructor(public data: DataService, route: ActivatedRoute, private vm: ViewModelService) {
    route.queryParams.subscribe(
      params => this.enableSearch = !!params["s/search"]);
   }

   ngOnInit(): void {
     this.vm.clear();
   }
}
