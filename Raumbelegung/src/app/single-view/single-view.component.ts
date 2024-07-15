import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss']
})
export class SingleViewComponent {

  @Input() items: any;
  @Input() date: any;

}
