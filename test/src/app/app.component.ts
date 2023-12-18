import { Component, OnInit } from '@angular/core';
import { PlayerExtensionService } from '@isign/player-extensions';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  onPlayer = false;
  displayId? = "";
  parameters?: { [key: string]: string };

  constructor(
    private readonly http: HttpClient,
    private readonly ext: PlayerExtensionService)
  {}

  async ngOnInit() {
    const player = await this.ext.getPlayer();
    let info;
    try {
      info = await player?.getInfo();
    }
    catch (error) {
      console.log("Could not read player info, probably not player available.", error);
    }

    this.displayId = info?.displayId;
    this.parameters = info?.parameters;
    this.onPlayer = !!this.displayId;
  }

  async pauseTest() {
    const player = await this.ext.getPlayer();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await player?.setPaused(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await player?.setPaused(false);
  }

  async writeLog() {
    const player = await this.ext.getPlayer();
    await player?.writeLog("test", 2, "Hello World");
  }

  async print() {
    const buffer = await firstValueFrom(this.http.get("assets/test.png", { responseType: 'arraybuffer' }));
    const printer = await this.ext.getPrinter();
    await printer?.printImage(buffer);
  }
}
