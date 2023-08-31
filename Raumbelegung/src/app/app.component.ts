import { ElementRef, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BookingViewModel } from './data/app-data.model';
import { DataService } from './data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  @ViewChild('scrollcontainer') scrollcontainer !: ElementRef;
  scrollingState : "down"|"downdelay"|"up"|"updelay" = "downdelay";
  scrollingCounter = 0;
  constructor(private dataService: DataService) {}

  current: BookingViewModel | null = null;

  ngOnInit(): void {
    timer(0, 10 * 1000).pipe(
      mergeMap(() => this.dataService.load())
    ).subscribe(
      data => this.current = data,
      error => console.error(error)
    );

    timer(0, 50).subscribe(
      _ => {
        if (!this.scrollcontainer) return;
        const scrollHeight = this.scrollcontainer.nativeElement.scrollHeight;
        const clientHeight = this.scrollcontainer.nativeElement.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        var top = this.scrollcontainer.nativeElement.scrollTop;
        switch (this.scrollingState) {
          case "down": {
            const scrollStep = clientHeight / 5 / (1000 / 50); // 5 seconds for one time height
            top += scrollStep;
            if (top > maxScroll) {
              top = maxScroll;
              this.scrollingState = "downdelay";
              this.scrollingCounter = 2 * (1000 / 50); // 2 seconds
            }
            break;
          }
          case "downdelay": {
            top = maxScroll;
            this.scrollingCounter--;
            if (this.scrollingCounter <= 0)
              this.scrollingState = "up";
              break;
          }
          case "up": {
            const scrollStep = clientHeight / 1 / (1000 / 50); // 1 second for one time height
            top -= scrollStep;
            if (top <= 0) {
              top = 0;
              this.scrollingState = "updelay";
              this.scrollingCounter = 2 * (1000 / 50); // 2 seconds
            }
            break;
          }
          case "updelay": {
            top = 0;
            this.scrollingCounter--;
            if (this.scrollingCounter <= 0)
              this.scrollingState = "down";
              break;
          }
        }
        this.scrollcontainer.nativeElement.scrollTop = top;
      }
    )
  }
}
