import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {DataFrame, fromCSV, IDataFrame} from "data-forge";
import {WebsocketService} from "./services/websocket.service";
import {SettingsService} from "./services/settings.service";
import {Block} from "./classes/settings";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adept';

  opened: boolean = true
  constructor(private ws: WebsocketService, public settings: SettingsService) {
    this.ws.ws.subscribe(data => {
      console.log(data)
    })
    this.settings.settings.blockMap[1] = {completed: false}
  }

  blockList: Block[] = [{id: 1, title: "Starting Data", active: true, completed: false}]


  toggleSideNav() {
    this.opened = !this.opened
  }


}
