import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item, TreeEntity } from '../data/app-data.model';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @Input() entity: TreeEntity|undefined;
  constructor(private svc: DataService) { }

  ngOnInit(): void {
    if (this.entity)
      this.svc.touch(this.entity).subscribe(
        data => {},
        error => console.error(error)
      );
  }
}
