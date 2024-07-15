import { Component, Input } from '@angular/core';
import { BookingViewModel } from '../data/app-data.model';

@Component({
  selector: 'app-double-view',
  templateUrl: './double-view.component.html',
  styleUrls: ['./double-view.component.scss']
})
export class DoubleViewComponent {
  @Input() items: BookingViewModel[] = [];
  @Input() date: string = "";

  constructor(){
   }
}
