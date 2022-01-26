import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Item } from '../data/app-data.model';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  category: Category|null = null;
  item: Item|null = null;
  constructor(private svc: DataService, route: ActivatedRoute) {
    route.params.subscribe(
      data => {
        const categoryId = data["cat"];
        const itemId = data["item"];
        svc.getCategory(categoryId).subscribe(
          data => { this.category = data; this.item = data.items[itemId] },
          error => console.error(error)
        );
      }
    );
  }

  ngOnInit(): void {
    if (this.item)
      this.svc.touch(this.item.id).subscribe(
        data => {},
        error => console.error(error)
      );
  }
}
